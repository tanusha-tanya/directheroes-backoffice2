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
    dhAccount: null,
    accounts: [],
    currentAccount: null,
    campaignToRename: null,
    newAccount: {
      accountState: 'add',
      password: '',
      isAdd: false
    }
  },

  actions: {
    getAccounts({ state, commit }, params) {
      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/list`
      }).then(({ data }) => {
        const { accountList, dhAccount } = data.response.body;

        // accountList.forEach( account => {
        //   // account.isPasswordValid = false;
        //   // account.threadList = account.campaignList;
        // })

        commit('set', {path: 'dhAccount', value: dhAccount});
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
      const request = accountRequestHandler('post', params)
      
      request
        .then(({ data }) => {
          const { account } = data.response.body;
          const { accounts, currentAccount } = state;

          accounts.splice(accounts.indexOf(currentAccount), 1, account);

          commit('set', {path: 'currentAccount', value: account});
        });

      return request;
    },

    getCampaignTemplates({ state, commit }, params) {
      const { campaignList } = state.currentAccount;
      const request = axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/get`,
        params: { id: params.campaign.id }
      })

      request.then(({ data }) => {
        if (params.noUpdates) return 

        campaignList.splice(campaignList.indexOf(params.campaign), 1, data.campaign);
      })

      return request;
    },

    saveCampaigns({ state, commit }, campaigns) {
      const { currentAccount } = state;
      const request = axios({
        method: 'post',
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/save`,
        data: {
          igAccount: { id: currentAccount.id },
          campaignList: campaigns,
          campaignTypeList: [campaigns[0].type]
        }
      })

      request.then(({ data }) => {
        const { campaignList } = data;

        campaignList.forEach(newCampaign => {
          const oldCampaign = currentAccount.campaignList.find(campaign => campaign.uuid == newCampaign.uuid)

          if (oldCampaign) {
            newCampaign.templateList.forEach((template, index) => {
              const campaignTemplate = oldCampaign.templateList[index];

              Object.keys(template).forEach(templateProperty => {
                if (templateProperty === 'ruleList') {
                  template.ruleList.forEach((rule, ruleIndex) => {
                    rule.actions.forEach((action, actionIndex) => {
                      campaignTemplate.ruleList[ruleIndex].actions[actionIndex].previewText = action.previewText;
                    })
                  })

                  return;
                };

                campaignTemplate[templateProperty] = template[templateProperty];
              })
            });
            // currentAccount.campaignList.splice(currentAccount.campaignList.indexOf(oldCampaign), 1, newCampaign);
          } else {
            currentAccount.campaignList.push(newCampaign);
          }
        })
      }).catch( error => {
        console.log(error);
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
