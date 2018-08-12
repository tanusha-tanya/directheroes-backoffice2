import Vue from 'vue'
import VueX from 'vuex'
import axios from 'axios'

Vue.use(VueX)

export default new VueX.Store({
  state: {
    accounts: [
      // {
      //   id: 1,
      //   name: '@Gate13',
      //   avatarURL: 'https://i.stack.imgur.com/CKnwO.png?s=128&g=1',
      //   followers: 13456,
      //   following: 15432,
      //   rememberme: true,
      //   logged: false,
      //   campaigns: [
      //     {
      //       id: 1,
      //       name: 'All the Stories',
      //       type: 'Story Campaign',
      //       active: true,
      //       templates:[
      //         {
      //           id: 1,
      //           rules: [
      //             {
      //               messages: ['Hello', 'Hi'],
      //               replies:{
      //                 text: 'dsfdfsdf',
      //                 actions: [
      //                   {id: 123, type: 233}
      //                 ]
      //               }
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       id: 2,
      //       name: 'Campaign Name',
      //       type: 'IGTV Campaign',
      //       active: true,
      //       templates:[
      //         {
      //           id: 1,
      //           rules: [
      //             {
      //               messages: [],
      //               replies:{
      //                 text: 'dsfdfsdf',
      //                 actions: [
      //                   {id: 123, type: 233}
      //                 ]
      //               }
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   id: 2,
      //   name: '@JimmyMoutzouris',
      //   followers: 45456,
      //   following: 132,
      //   rememberme: false,
      //   logged: true,
      // },
      // {
      //   id: 3,
      //   name: '@Brasilia',
      //   followers: 24456,
      //   following: 1542,
      //   rememberme: true,
      // }
    ],
    currentAccount: null,
    campaignToRename: null,
  },

  actions: {
    getAccounts({ state, commit }, params) {
      axios({
        url: `/api/1.0.0/${ dh.userName }/ig_account/list`
      }).then(({ data }) => {
        const { accountList } = data.response.body;

        accountList.forEach(account => {
          account.campaignList.forEach( campaign => {
            campaign.templates = [{
              id: 1,
              rules: [
                {
                  messages: ['Hello', 'Hi'],
                  replies:{
                    text: 'dsfdfsdf',
                    actions: [
                      {id: 123, type: 233}
                    ]
                  }
                }
              ]
            }]
          });
        })

        commit('set', {path: 'accounts', value: accountList});
      })
    },

    addAccount({ state, commit }, params) {
      return axios({
        url: `/api/1.0.0/${ dh.userName }/ig_account/save`,
        method: 'post',
        data: { account: params}
      }).then(({ data }) => {
        console.log(data);
      })
    }
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
  }
})