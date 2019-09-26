import Vue from 'vue'
import Router from 'vue-router'

import Accounts from './views/Accounts'
import AccountDetails from './views/AccountDetails'
import AccountDashboard from './views/AccountDashboard'
import CampaignList from './views/CampaignList'
import CampaignBuilder from './views/CampaignBuilder'
import BroadcastList from './views/BroadcastList'
import BroadcastBuilder from './views/BroadcastBuilder'
import Audience from './views/Audience'
import LiveChat from './views/LiveChat'
import Settings from './views/Settings'
import Tutorials from './views/Tutorials'
import ProfileGeneral from './views/ProfileGeneral'
import ProfileSecurity from './views/ProfileSecurity'
import ProfileBilling from './views/ProfileBilling'
import AddonBuy from './views/AddonBuy'
import AddonPayment from './views/AddonPayment'
import Affiliate from './views/Affiliate'

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
    { path: '/affiliate', name: 'affiliate', component: Affiliate },
    { path: '/tutorials', name: 'tutorials', component: Tutorials },
    { path: '/settings', component: Settings,
      children: [
        { name: 'settings', path: '', component: ProfileGeneral },
        { name: 'security', path: 'security', component: ProfileSecurity },
        { name: 'billing', path: 'billing', component: ProfileBilling },
      ]
    },
    { name: 'addonBuy', path: '/addon-buy', component: AddonBuy },
    { name: 'addonPayment', path: '/addon-buy/payment', component: AddonPayment },
    { path: '/:accountId', component: AccountDetails,
      children: [
        { name: 'accountHome', path: '', component: AccountDashboard },
        { name: 'accountCampaignList', path: 'campaigns', component: CampaignList },
        { name: 'accountCampaign', path: 'campaigns/:campaignId', component: CampaignBuilder },
        { name: 'accountBroadcastList', path: 'broadcasts', component: BroadcastList },
        { name: 'accountBroadcast', path: 'broadcasts/:campaignId', component: BroadcastBuilder },
        { name: 'audience', path: 'audience', component: Audience },
        { name: 'livechat', path: 'livechat/:threadId?/:subscribed?', component: LiveChat },
        // { name: 'accountThreadInfo', path: 'subscriber/:subscriberId', component: accountThreadInfo },
      ]
    },
    { path: '/:isBuy?', name: 'accounts', component: Accounts },
  ]
});


