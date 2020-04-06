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
import Trainings from './views/Trainings'
import ProfileGeneral from './views/ProfileGeneral'
import ProfileSecurity from './views/ProfileSecurity'
import ProfileBilling from './views/ProfileBilling'
import ProfileManagers from './views/ProfileManagers'
import AddonBuy from './views/AddonBuy'
import AddonPayment from './views/AddonPayment'
import Affiliate from './views/Affiliate'
import SubscriberInfo from './views/SubscriberInfo'
import CampaignStatistics from './views/CampaignStatistics'
import UiKit from './views/UiKit'
import utils from '../oldJS/utils'

const { permission } = utils;

Vue.use(Router)
const routesDev = [];
if (process.env.NODE_ENV === 'development') {
  routesDev.push({ path: '/ui-kit', name: 'ui-kit', component: UiKit });
}

export default new Router({
  routes: routesDev.concat([
    // { path: '/bookhelp', name: 'book-help', component: bookHelp },
    { path: '/partner-program', name: 'affiliate', component: Affiliate },
    { path: '/tutorials', name: 'tutorials', component: Tutorials },
    { path: '/trainings', name: 'trainings', component: Trainings },
    { path: '/settings', component: Settings,
      children: [
        { name: 'settings', path: '', component: ProfileGeneral },
        { name: 'security', path: 'security', component: ProfileSecurity },
        { name: 'billing', path: 'billing', component: ProfileBilling },
        { name: 'assignment', path: 'assignment', component: ProfileManagers },
      ]
    },
    { name: 'addonBuy', path: '/addon-buy', component: AddonBuy },
    { name: 'addonPayment', path: '/addon-buy/payment', component: AddonPayment },
    { path: '/:accountId', component: AccountDetails,
      children: [
        { name: 'accountHome', path: '', component: AccountDashboard },
        { name: 'accountCampaignList', path: 'campaigns', component: CampaignList, meta: { code: permission.CAMPAIGN } },
        { name: 'accountCampaign', path: 'campaigns/:campaignId', component: CampaignBuilder, meta: { code: permission.CAMPAIGN } },
        { name: 'accountCampaignStatistics', path: 'campaigns/:campaignId/statistics', component: CampaignStatistics, meta: { code: permission.CAMPAIGN } },
        { name: 'accountBroadcastList', path: 'broadcasts', component: BroadcastList, meta: { code: permission.BROADCAST } },
        { name: 'accountBroadcast', path: 'broadcasts/:campaignId', component: BroadcastBuilder, meta: { code: permission.BROADCAST } },
        { name: 'accountBroadcastStatistics', path: 'broadcasts/:campaignId/statistics', component: CampaignStatistics },
        { name: 'subscriber', path: 'audience/:threadId', component: SubscriberInfo },
        { name: 'audience', path: 'audience', component: Audience, meta: { code: permission.AUDIENCE } },
        { name: 'livechat', path: 'livechat/:threadId?', component: LiveChat, meta: { code: permission.LIVE_CHAT } },
        // { name: 'accountThreadInfo', path: 'subscriber/:subscriberId', component: accountThreadInfo },
      ]
    },
    { path: '/:isBuy?', name: 'accounts', component: Accounts }
  ])
});


