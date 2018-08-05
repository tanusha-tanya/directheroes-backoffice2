import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX)

export default new VueX.Store({
  state: {
    accounts: [
      {
        id: 1,
        name: '@Gate13',
        avatarURL: 'https://i.stack.imgur.com/CKnwO.png?s=128&g=1',
        followers: 13456,
        following: 15432,
        compaigns: [
          {
            id: 1,
            name: 'All the Stories',
            type: 'Story Campaign',
            active: true,
            templates:[
              {
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
              }
            ]
          },
          {
            id: 2,
            name: 'Campaign Name',
            type: 'IGTV Campaign',
            active: true,
            templates:[
              {
                id: 1,
                rules: [
                  {
                    message: '',
                    replies:{
                      text: 'dsfdfsdf',
                      actions: [
                        {id: 123, type: 233}
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: '@JimmyMoutzouris',
        followers: 45456,
        following: 132
      },
      {
        id: 3,
        name: '@Brasilia',
        followers: 24456,
        following: 1542
      }
    ],
    currentAccount: {}
  },

  mutations: {
    selectAccount(state, account) {
      if (state.currentAccount === account) return;

      state.currentAccount = account;
    },

    addAccount(state) {
      console.log(state);
    }
  }
})