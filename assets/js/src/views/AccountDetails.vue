<template>
  <router-view></router-view>
</template>

<script>
import PouchDB from 'pouchdb';

const jsondiffpatch = require('jsondiffpatch').create({
  objectHash: function(obj) {
      return obj.name;
  }
})

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
      localDB: null,
      requestTimeout: null,
    }
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

      const localDB = new PouchDB(`pouch-local-${ account.id}`)
      const remoteDB = new PouchDB(account.couchDbUrl);

      localDB.replicate.from(remoteDB).on('complete', () => {
        localDB.get(String(accountId)).catch(error => {
          if (error.status !== 404) return;

          return localDB.put({
            _id: String(accountId),
            campaigns: [],
          })
        })
        .then(record => {
          if (record && record.ok) {
            return localDB.get(String(accountId))
          }

          return record;
        }).then(record => {
          $store.commit('set', {path: 'currentAccountData', value: record})
        });

        const syncDB = PouchDB.sync(localDB, remoteDB, {
          live: true,
          retry: true
        }).on('change', result => {
          const { currentAccountData, onSaveHandler } = this.$store.state
          const resultDoc = result.change.docs[0];

          if (onSaveHandler) {
            onSaveHandler();
            this.$store.commit('set', { path: 'onSaveHandler', value: null });
          };

          if (currentAccountData._rev === resultDoc._rev) return;

          delete resultDoc._revisions;

          const delta = jsondiffpatch.diff(currentAccountData, resultDoc);

          this.revUpdate = true

          jsondiffpatch.patch(currentAccountData, delta);
        })
      });

      this.localDB = localDB;
    },

    saveAccountData(data) {
      const { localDB, requestTimeout, $store } = this;
      const { saveTimeout } = $store.state;
      const saveHandler = () => {
        localDB.put(data).then(result => {
          this.revUpdate = true;

          data._rev = result.rev;
        });

        $store.commit('set', { path: 'saveTimeout', value: 500 })
      }

      clearTimeout(requestTimeout);

      this.requestTimeout = setTimeout(saveHandler, saveTimeout)
    }
  },

  watch: {
    '$store.state.accounts'() {
      if (this.currentAccount) return;

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