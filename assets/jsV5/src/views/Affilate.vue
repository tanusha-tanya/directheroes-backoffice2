<template>
  <div class="dh-view dh-affilate-view">
    <dh-header title="Affilate"></dh-header>
    <div class="dh-view-content">
      <div class="dh-affilate" v-if="affilateInfo">
        <div class="dh-affilate-row">
          <div class="dh-affilate-column dh-affilate-payout">
            <div>We will send affilate payments to:</div>
            <div>{{affilateInfo.settings.payoutEmail}}</div>
            <div>Payments are made on the first of every month.</div>
          </div>
          <div class="dh-affilate-column dh-affilate-link">
            <div>Your referal link:</div>
            <div>{{affilateInfo.settings.referrerCode}}</div>
            <div>Please use this for all referals.</div>
          </div>
        </div>
        <div class="dh-affilate-row">
          <div class="dh-affilate-column">
            <div>Link Statistics:</div>
            <div>Link Clicks: 95</div>
            <div>Click-Through Rate: 0.063</div>
          </div>
          <div class="dh-affilate-column">
            <div>Payout Statistics:</div>
            <div>Total Earnings: 14.00</div>
            <div>Total Unpaid: 0</div>
          </div>
        </div>
        <div class="dh-affilate-row">
          <div class="dh-affilate-column" >
            <div>Referal users</div>
            <div class="dh-referal-user">
              <div class="dh-referal-user-item dh-referal-user-header">
                <div class="dh-referal-user-email">User</div>
                <div class="dh-referal-user-bounty">Total Earned</div>
                <div class="dh-referal-user-joined-at">Start Date</div>
                <div class="dh-referal-user-subscribe">Status</div>
              </div>
              <div class="dh-referal-user-item" v-for="(reportItem, index) in affilateInfo.report" :key="reportItem.referredUserJoinedAt + index">
                <div class="dh-referal-user-email">{{reportItem.referredUserEmailMasked}}</div>
                <div class="dh-referal-user-bounty">{{reportItem.allTimeAffiliateBounty}}</div>
                <div class="dh-referal-user-joined-at">{{dateFormated(reportItem.referredUserJoinedAt)}}</div>
                <div class="dh-referal-user-subscribe">{{reportItem.referredUserIsSubscribed ? 'Active' : 'Inactive'}}</div>
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

export default {
  data() {
    return {
      affilateInfo: null,
    }
  },

  components: {
    dhHeader,
    dhFooter,
    loader
  },

  methods: {
    dateFormated(date) {
      return moment(date).format('DD/MM/YYYY')
    }
  },

  created() {
    axios({
      url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/affiliate/report`,
      method: 'post',
    })
    .then(({ data }) => {
      this.affilateInfo = data.response.body;
    })
  }
};
</script>

<style lang="scss">
.dh-affilate-view {
  .dh-view-content {
    display: flex;
    flex-direction: column;
  }

  .dh-loader {
    flex-grow: 1;
  }

  .dh-affilate {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .dh-affilate-row {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &:last-child {
      flex-grow: 1
    }
  }

  .dh-affilate-column {
    background-color: $sectionBG;
    border-radius: 4px;
    padding: 20px;
    flex-grow: 1;
    box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);

    &:not(:last-child) {
      margin-right: 20px;
    }
  }

  .dh-affilate-payout, .dh-affilate-link {
    text-align: center
  }

  .dh-referal-user-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #F2F4F6;

    & > * {
      width: 25%;
      text-align: center;
    }
  }
}
</style>