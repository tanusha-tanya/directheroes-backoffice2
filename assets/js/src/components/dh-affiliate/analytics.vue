<template>
  <div>
    <div class="dh-affiliate" v-if="affiliateInfo">
      <div class="dh-affiliate-row">
        <div class="dh-affiliate-column">
          <div class="dh-affiliate-column-title">Referral Statistics:</div>
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
        <div class="dh-affiliate-column">
          <div class="dh-affiliate-column-title">Referral users</div>
          <div class="dh-referral-user">
            <div class="dh-referral-user-item dh-referral-user-header">
              <div class="dh-referral-user-email">User</div>
              <div class="dh-referral-user-bounty">Total Earned</div>
              <div class="dh-referral-user-joined-at">Start Date</div>
              <div class="dh-referral-user-subscribe">Status</div>
            </div>
            <div
              class="dh-referral-user-item"
              v-for="(reportItem, index) in affiliateInfo.report"
              :key="reportItem.referredUserJoinedAt + index"
            >
              <div class="dh-referral-user-email">{{reportItem.referredUserEmailMasked}}</div>
              <div class="dh-referral-user-bounty">{{reportItem.allTimeAffiliateBounty}}</div>
              <div
                class="dh-referral-user-joined-at"
              >{{dateFormated(reportItem.referredUserJoinedAt)}}</div>
              <div
                class="dh-referral-user-subscribe"
              >{{reportItem.referredUserIsSubscribed ? 'Active' : 'Inactive'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loader v-else />
  </div>
</template>

<script>
import loader from "../dh-loader";
import moment from "moment";

export default {
  components: {
    loader
  },

  props: ["affiliateInfo"],

  methods: {
    dateFormated(date) {
      return moment(date).format("DD/MM/YYYY");
    }
  }
};
</script>