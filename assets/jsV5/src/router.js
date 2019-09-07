import Vue from 'vue'
import Router from 'vue-router'

import Accounts from './views/Accounts'
import AccountDetails from './views/AccountDetails'
import AccountDashboard from './views/AccountDashboard'
import CampaignList from './views/CampaignList'
import BroadcastList from './views/BroadcastList'
import Audience from './views/Audience'
import LiveChat from './views/LiveChat'

// import broadcastList from '../../js/src/routes/broadcastList.vue'
// import broadcastBuilder from '../../js/src/routes/broadcastBuilder.vue'

// import campaignBuilder from '../../js/src/routes/campaignBuilder.vue'
// import accountThread from '../../js/src/routes/accountThread.vue'

// import accountThreadMessages from '../../js/src/routes/accountThreadMessages.vue'
// import accountThreadInfo from '../../js/src/routes/accountThreadInfo.vue'
// import accountDH from '../../js/src/routes/accountDH.vue'
// import accountDHProfile from '../../js/src/routes/accountDHProfile.vue'
// import accountDHPayment from '../../js/src/routes/accountDHPayment.vue'
// import accountDHSubscription from '../../js/src/routes/accountDHSubscription.vue'
// import videoHelp from '../../js/src/routes/videoHelp.vue'
// import bookHelp from '../../js/src/routes/bookHelp.vue'
// import addonBuy from '../../js/src/routes/addonBuy.vue'
// import addonPayment from '../../js/src/routes/addonPayment.vue'

Vue.use(Router)

export default new Router({
  routes:[
    // { path: '/bookhelp', name: 'book-help', component: bookHelp },
    // { path: '/videohelp', name: 'video-help', component: videoHelp },
    // { path: '/settings', component: accountDH,
    //   children: [
    //     { name: 'dhProfile', path: '', component: accountDHProfile },
    //     { name: 'dhPayments', path: 'payments', component: accountDHPayment },
    //     { name: 'dhSubscriptions', path: 'subscriptions', component: accountDHSubscription },
    //   ]
    // },
    // { name: 'addonBuy', path: '/addon-buy', component: addonBuy },
    // { name: 'addonPayment', path: '/addon-buy/payment', component: addonPayment },
    { path: '/:accountId', component: AccountDetails,
      children: [
        { name: 'accountHome', path: '', component: AccountDashboard },
        { name: 'accountCampaignList', path: 'campaigns', component: CampaignList },
        // { name: 'accountCampaign', path: 'campaigns/:campaignId', component: campaignBuilder },
        { name: 'accountBroadcastList', path: 'broadcasts', component: BroadcastList },
        // { name: 'accountBroadcast', path: 'broadcasts/:campaignId', component: broadcastBuilder },
        { name: 'audience', path: 'audience', component: Audience },
        { name: 'livechat', path: 'livechat/:threadId?', component: LiveChat },
        // { name: 'accountThreadInfo', path: 'subscriber/:subscriberId', component: accountThreadInfo },
      ]
    },
    { path: '/:isBuy?', name: 'accounts', component: Accounts },
  ]
});


