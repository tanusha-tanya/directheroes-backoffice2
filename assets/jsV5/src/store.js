import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
    isFirstLoad: false,
    currentAccount: null,
    currentAccountData: null,
    loading: false,
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
    }
  },
  actions: {
    getAccounts({ state, commit }) {
      commit('set', { path: 'isFirstLoad', value: true });

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/list`
      }).then(({ data }) => {
        const { accountList, dhAccount } = data.response.body;

        commit('set', { path: 'dhAccount', value: dhAccount });
        commit('set', { path: 'accounts', value: accountList });
        commit('set', { path: 'isFirstLoad', value: false });
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
  }
})
