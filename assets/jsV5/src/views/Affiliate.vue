<template>
  <div class="dh-view dh-affiliate-view">
    <dh-header title="Affiliate"></dh-header>
    <div class="dh-view-content">
      <div class="dh-affiliate" v-if="affiliateInfo">
        <div class="dh-affiliate-row dh-affiliate-info">
          <div class="dh-affiliate-column">
            <div>We will send affiliate payments to:</div>
            <div>
              <input type="text" class="dh-input" v-model="affiliateInfo.settings.payoutEmail" @input="payoutEmailChanged = true"/>
              <button v-if="payoutEmailChanged" :class="{'dh-button':true, 'dh-small':true, 'dh-loading':saving}" @click="saveAffiliateInfo">Save</button>
            </div>
            <div>Payments are made on the first of every month.</div>
          </div>
          <div class="dh-affiliate-column">
            <div>Your referral link:</div>
            <div class="dh-affiliate-link">
              {{dh.apiUrl}}/check-out/?ref=
              <input type="text" class="dh-input" @input="referrerCodeChanged = true" v-model="affiliateInfo.settings.referrerCode"/>
              <button v-if="referrerCodeChanged" :class="{'dh-button':true, 'dh-small':true, 'dh-loading':saving}" @click="saveAffiliateInfo">Save</button>
              <button v-else class="dh-button dh-small dh-link-button" @click="copyRefLink">
                <dh-link/>
              </button>
            </div>
            <div>Please use this for all referrals.</div>
          </div>
        </div>
        <div class="dh-affiliate-row">
          <div class="dh-affiliate-column">
            <div class="dh-affiliate-column-title">Affiliate Statistics:</div>
            <div>Total referrals: {{ affiliateInfo.report.length }}</div>
            <div>Active referrals: {{ affiliateInfo.report.filter(reportItem => reportItem.referredUserIsSubscribed).length }}</div>
          </div>
          <div class="dh-affiliate-column">
            <div class="dh-affiliate-column-title">Payout Statistics:</div>
            <div>Total Earnings: 0</div>
            <div>Total Unpaid: 0</div>
          </div>
        </div>
        <div class="dh-affiliate-row">
          <div class="dh-affiliate-column" >
            <div class="dh-affiliate-column-title">Referral users</div>
            <div class="dh-referral-user">
              <div class="dh-referral-user-item dh-referral-user-header">
                <div class="dh-referral-user-email">User</div>
                <div class="dh-referral-user-bounty">Total Earned</div>
                <div class="dh-referral-user-joined-at">Start Date</div>
                <div class="dh-referral-user-subscribe">Status</div>
              </div>
              <div class="dh-referral-user-item" v-for="(reportItem, index) in affiliateInfo.report" :key="reportItem.referredUserJoinedAt + index">
                <div class="dh-referral-user-email">{{reportItem.referredUserEmailMasked}}</div>
                <div class="dh-referral-user-bounty">{{reportItem.allTimeAffiliateBounty}}</div>
                <div class="dh-referral-user-joined-at">{{dateFormated(reportItem.referredUserJoinedAt)}}</div>
                <div class="dh-referral-user-subscribe">{{reportItem.referredUserIsSubscribed ? 'Active' : 'Inactive'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <loader v-else/>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import loader from '../components/dh-loader'
import dhLink from '../assets/link.svg'

export default {
  data() {
    return {
      affiliateInfo: null,
      payoutEmailChanged: false,
      referrerCodeChanged: false,
      saving: false,
    }
  },

  components: {
    dhHeader,
    dhFooter,
    loader,
    dhLink
  },

  computed: {
    dh() {
      return window.dh;
    }
  },

  methods: {
    dateFormated(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    saveAffiliateInfo() {
      const { referrerCode, payoutEmail } = this.affiliateInfo.settings
      this.saving = true;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/affiliate/save-settings`,
        method: 'post',
        data: {
          affiliateCode: referrerCode,
          payoutEmail
        }
      })
      .then(({ data }) => {

        console.log(data);

        this.payoutEmailChanged = false;
        this.referrerCodeChanged = false;
        this.saving = false;
      })
    },

    copyRefLink() {
      const { referrerCode } = this.affiliateInfo.settings
      const referralLink = `${dh.apiUrl}/check-out/?ref=${referrerCode}`
      const input = document.createElement('input');

      input.setAttribute('value', referralLink);
      input.style.position = 'absolute'
      input.style.opacity = 0;
      input.style.pointerEvents = 'none';
      document.body.appendChild(input);
      input.focus();
      input.select();
      document.execCommand('copy')
      document.body.removeChild(input)
    }
  },

  created() {
    axios({
      url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/affiliate/report`,
      method: 'post',
    })
    .then(({ data }) => {
      this.affiliateInfo = data.response.body;
    })
  }
};
</script>

<style lang="scss">
.dh-affiliate-view {
  .dh-view-content {
    display: flex;
    flex-direction: column;
  }

  .dh-loader {
    flex-grow: 1;
  }

  .dh-affiliate {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .dh-affiliate-row {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &:last-child {
      flex-grow: 1
    }
  }

  .dh-affiliate-column {
    background-color: $sectionBG;
    border-radius: 4px;
    padding: 20px;
    flex-grow: 1;
    box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);

    &:not(:last-child) {
      margin-right: 20px;
    }

    .dh-input {
      padding: 5px;
      margin: 10px 0;
      font-weight: bold;
    }

    .dh-button {
      margin-left: 10px;
    }
  }

  .dh-affiliate-link {
    color: $elementActiveColor;
  }

  .dh-affiliate-info {
    .dh-affiliate-column {
      text-align: center;
    }
  }

  .dh-referral-user-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #F2F4F6;

    & > * {
      width: 25%;
      text-align: center;
    }
  }

  .dh-affiliate-column-title {
    font-weight: 500;
    margin-bottom: 3px;
  }

  .dh-link-button {
    padding: 5px 7px !important;
  }
}
</style>