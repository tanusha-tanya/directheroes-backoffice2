import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import PouchDB from 'pouchdb';

const accountRequestHandler = (method, params) => {
  return axios({
    url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/save`,
    method,
    data: { account: params}
  })
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dhAccount: null,
    accounts: [],
    accountStatistics: {},
    isFirstLoad: false,
    currentAccount: null,
    currentAccountData: null,
    loading: false,
    existConnection: null,
    globalError: false,
    saveTimeout: 1000,
    onSaveHandler: null,
    purchasePlans: false,
    campaignTemplates: null,
  },

  mutations: {
    set(state, { path, value }) {
      const nodes = path.split('.');
      const lastNode = nodes[nodes.length - 1];

      let source = path.split('.').reduce(( source, node ) => {
        if (node === lastNode) return source;
        if (!source || !source.hasOwnProperty(node)) return;

        return source[node];
      }, state);

      if (!source) return console.error(`Can\'t find source by path ${ path }.` );

      source[lastNode] = value;
    },

    selectAccount(state, account) {
      if (state.currentAccount === account) return;

      state.currentAccount = account;
    },

    saveStatistics(state, dataset) {
      const { currentAccount } = state;

      if (!currentAccount) return;

      let data = null;

      if (state.accountStatistics.hasOwnProperty(currentAccount.id)) {
        data = state.accountStatistics[currentAccount.id];
      }

      Vue.set(state.accountStatistics, currentAccount.id, { ...data, ...dataset });
    }
  },

  actions: {
    getAccounts({ state, commit, dispatch }) {
      commit('set', { path: 'isFirstLoad', value: true });

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/list`
      }).then(({ data }) => {
        const { viewedBy } = data.response;
        const { accountList, dhAccount } = data.response.body;

        dhAccount.isAdmin = !viewedBy || !viewedBy.parentUserId;

        // dhAccount.flowBuilderSettings.elements.push('saveCustomField')

        dhAccount.flowBuilderSettings.userInputMatches = [{value: '{{email}}', title: 'E-mail'}, {value: '{{phone}}', title: 'Phone'}]

        commit('set', { path: 'dhAccount', value: dhAccount });
        commit('set', { path: 'accounts', value: accountList });
        commit('set', { path: 'isFirstLoad', value: false });

        dispatch('getCampaignTemplates', dhAccount)
      }).catch(() => {
        commit('set', { path: 'isFirstLoad', value: false });
      })
    },

    addAccount({ state, commit }, params) {
      const { accounts } = state;
      const request = accountRequestHandler('post', params)

      request.then(({ data }) => {
        const { account } = data.response.body;

        accounts.push(account);
      });

      return request
    },

    deleteAccount({ state, commit }, params) {
      const { accounts } = state;
      const request = accountRequestHandler('delete', params)

      request.then(({ data }) => {
        accounts.splice(accounts.indexOf(params),1)
      })

      return request
    },

    saveAccount({ state, commit }, params) {
        const request = accountRequestHandler('post', params)

        request.then(({ data }) => {
          const { account } = data.response.body;
          const { accounts } = state;
          const currentAccount = accounts.find(accountItem => accountItem.id == account.id)

          accounts.splice(accounts.indexOf(currentAccount), 1, account);
        });

        return request;
    },

    updateSubscriptionCapabilities({ state, commit }) {
      const { currentAccount } = state;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/${ currentAccount.id }/subscription-capabilities`,
      }).then(({ data }) => {
        commit('set', { path: 'currentAccount.subscriptionCapabilities', value: data.response.body})
      })
    },

    getCampaignTemplates({ commit }, dhAccount) {
      const localDB = new PouchDB(`dh-campaign-templates`);
      const remoteDB = new PouchDB(dhAccount.marketCouchdbUrl);

      localDB.replicate.from(remoteDB).on('complete', () => {
        localDB.get(String(dhAccount.marketAccountId)).then(record => {
          const availableTemplates = record.campaigns.filter(campaign => campaign.isActive);

          commit('set', { path: 'campaignTemplates', value: availableTemplates })
        });
      })
    }
  }
})
