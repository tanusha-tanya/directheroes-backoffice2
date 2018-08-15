import Vue from 'vue'
import VueX from 'vuex'
import axios from 'axios'

const accountRequestHandler = (method, params) => {
  return axios({
    url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/save`,
    method,
    data: { account: params}
  })
}

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
    newAccount: {
      accountState: 'add',
      isAdd: false
    }
  },

  actions: {
    getAccounts({ state, commit }, params) {
      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/list`
      }).then(({ data }) => {
        const { accountList } = data.response.body;

        // accountList.forEach(account => {
        //   account.campaignList.forEach( campaign => {
        //     campaign.templates = [{
        //       id: 1,
        //       rules: [
        //         {
        //           messages: ['Hello', 'Hi'],
        //           replies:{
        //             text: 'dsfdfsdf',
        //             actions: [
        //               {id: 123, type: 233}
        //             ]
        //           }
        //         }
        //       ]
        //     }]
        //   });
        // })

        commit('set', {path: 'accounts', value: accountList});
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
      return accountRequestHandler('post', params)
    },

    getCampaignTemplates({ state, commit }, campaign) {
      const { campaignList } = state.currentAccount;
      const request = axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/get`,
        params: { id: campaign.id }
      })

      request.then(({ data }) => {
        campaignList.splice(campaignList.indexOf(campaign), 1, data.campaign);
      })

      return request;
    },

    saveCampaigns({ state, commit }, campaign) {
      const { currentAccount } = state;
      const request = axios({
        method: 'post',
        url: `${ dh.apiUrl }/ig/accounts/${ currentAccount.login }/build/campaigns/save`,
        data: {
          igAccount: { id: currentAccount.id },
          campaignList: [campaign],
          campaignTypeList: [campaign.type]
        }
      })

      request.then(({ data }) => {
        const { campaignList } = data;
        const newCampaign = campaignList[0];

        if (newCampaign.oldId) {
          currentAccount.campaignList.push(newCampaign)
        } else {
          currentAccount.campaignList.splice(currentAccount.campaignList.indexOf(campaign), 1, newCampaign)
        }
      })

      return request;
    },

    deleteCampaign({ state, commit }, campaign) {
      const request = axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/archive`,
        params: { id: campaign.id }
      })

      request.then(({ data }) => {
        const { campaignList } = state.currentAccount;

        campaignList.splice(campaignList.indexOf(campaign), 1);
      })

      return request;
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