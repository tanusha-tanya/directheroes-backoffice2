<template>
  <router-view></router-view>
</template>

<script>
import PouchDB from 'pouchdb';
import debounce from 'lodash/debounce';

export default {
  beforeRouteEnter(to, from, next) {
    next(accountComponent => {
      accountComponent.selectAccount(to);
    });
  },

  beforeRouteLeave(to, from, next) {
    this.$store.commit('set', { path: 'currentAccount', value: null});
    this.$store.commit('set', { path: 'currentAccountData', value: null});
    next();
  },

  data() {
    return {
      pouchDB: null,
      revUpdate: false,
    }
  },

  computed: {
    account() {
      return this.$store.state.currentAccount;
    },
  },

  methods: {
    selectAccount(route) {
      const { $store, dhAccount } = this
      const { accounts } = $store.state
      const { accountId } = route.params

      if (!accountId) return;

      const account = accounts.find(account => account.id == accountId);

      if (account) {
        $store.commit('selectAccount', account)
      } else {
        this.$router.push({name: 'accounts'});
        return;
      }

      const db = new PouchDB(dhAccount.couchdbUrl);
      // const db = new PouchDB({name: dhAccount.userCode});
      // const db = new PouchDB(`e9b53febd06c403c8cb7ba4fd9d3533a`);
      db.info().then(console.log)

      this.pouchDB = db;

      db.changes({ live: true }).on('change', (a) => {
        const { currentAccountData } = this.$store.state;

        // console.log('Db Changes',currentAccountData, a);

        // if (!currentAccountData) return;

        // console.log(currentAccountData);


        // db.put(currentAccountData);
      });

      db.get(String(accountId))
        .catch(error => {
          if (error.status !== 404) return;

          return db.put({
            _id: String(accountId),
            campaigns: [],
          })
        })
        .then(record => {
          if (record && record.ok) {
           return db.get(String(accountId))
          }

          return record;
        })
        .then(record => {
          $store.commit('set', {path: 'currentAccountData', value: record})
        })
    },

    saveAccountData: debounce(function (data) {
      const { pouchDB } = this;

      if (!pouchDB) return;

      pouchDB.put(data).then(record => {
        this.revUpdate = true;

        console.log('Record', record);

        data._rev = record.rev;

        console.log('Data', data);
      }).catch(error => {
        console.dir(data._rev, error)
      })
    }, 1000)
  },

  watch: {
    '$store.state.accounts'() {
      if (this.account) return;

      this.selectAccount(this.$route);
    },

    '$store.state.currentAccountData': {
      handler(newData, oldData) {
        const { saveAccountData } = this;

        if (this.revUpdate) return this.revUpdate = false;

        if (!newData || !oldData || oldData._id !== newData._id) return;

        saveAccountData(newData);
      },
      deep: true
    },
  }
}
</script>