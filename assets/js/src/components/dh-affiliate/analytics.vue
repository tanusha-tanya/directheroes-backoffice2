<template>
  <div>
    <div class="dh-affiliate" v-if="affiliateInfo">
      <div class="dh-affiliate-row">
        <div class="dh-affiliate-column">
          <div class="dh-affiliate-column__title">Referral statistics</div>
          <div class="dh-affiliate-column__body">
            <dh-referral-analytics :referrals="affiliateInfo.report" />
          </div>
        </div>
        <div class="dh-affiliate-column dh-affiliate-column--hidden">
          <template v-if="false">
            <div class="dh-affiliate-column__title">Payout Statistics:</div>
            <div class="dh-affiliate-column__body">
              <dh-payout-analytics :payouts="[]" />
            </div>
          </template>
        </div>
      </div>
      <div class="dh-affiliate-row">
        <div class="dh-affiliate-column">
          <div class="dh-affiliate-column__title">Referral users</div>
          <div class="dh-affiliate-column__body">
            <div class="dh-referral-user">
              <div class="dh-referral-user-item dh-referral-user-item--header">
                <div class="dh-referral-user dh-referral-user--first">User</div>
                <div class="dh-referral-user">Total earned</div>
                <div class="dh-referral-user">Start date</div>
                <div class="dh-referral-user">Status</div>
              </div>
              <div
                class="dh-referral-user-item"
                v-for="(reportItem, index) in affiliateInfo.report"
                :key="reportItem.referredUserJoinedAt + index"
              >
                <div
                  class="dh-referral-user dh-referral-user--email dh-referral-user--first"
                >{{reportItem.referredUserEmailMasked}}</div>
                <div
                  class="dh-referral-user dh-referral-user--bounty"
                >{{reportItem.allTimeAffiliateBounty}}</div>
                <div
                  class="dh-referral-user dh-referral-user--joined-at"
                >{{ reportItem.referredUserJoinedAt }}</div>
                <div class="dh-referral-user dh-referral-user--subscribe">
                  <span
                    class="dh-referral-subscribe-tag"
                    :class="{'dh-referral-user--active': reportItem.referredUserIsSubscribed}"
                  >{{reportItem.referredUserIsSubscribed ? 'Active' : 'Inactive'}}</span>
                </div>
              </div>
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
import dhReferralAnalytics from "./analytics/referral-analytics";
import dhPayoutAnalytics from "./analytics/payout-analytics";

export default {
  components: {
    loader,
    dhReferralAnalytics,
    dhPayoutAnalytics
  },

  props: ["affiliateInfo"]
};
</script>

<style lang="scss">
$subscribe-active-status-color: $secondary2;
$subscribe-inactive-status-color: $secondary3;
$referral-user-item-border-color: $background2;

$referral-subscribe-status-background-color: rgba(152, 169, 188, 0.08);
$referral-subscribe-status-text-color: $secondaryDark1;

.dh-notify-success {
  background-color: $secondary1;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $primaryDark;
  border-radius: 4px;

  svg {
    width: 24px;
    height: 24px;
    color: inherit;

    &.dh-notify-close {
      cursor: pointer;
    }
  }

  span {
    font-size: 14px;
    line-height: 17px;
    color: inherit;
  }

  & + .popper__arrow {
    border-width: 12px !important;
    top: -24px !important;
    border-bottom-color: $secondary1 !important;

    &:after {
      border-bottom-color: $secondary1 !important;
    }
  }
}

.dh-affiliate {
  .dh-affiliate-column.dh-affiliate-column--hidden {
    visibility: hidden;
    flex-grow: 5;
  }
}

.dh-referral-user-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid $referral-user-item-border-color;
  min-height: 40px;
  align-items: center;
  pointer-events: none;

  &:last-child {
    border-bottom: unset;
  }

  &.dh-referral-user-item--header {
    padding-top: 0px;
    font-weight: 500;
  }

  .dh-referral-user {
    width: 18%;

    &.dh-referral-user--subscribe .dh-referral-subscribe-tag {
      padding: 5px 10px;
      background-color: $referral-subscribe-status-background-color;
      border-radius: 4px;
      color: $referral-subscribe-status-text-color;
    }

    &.dh-referral-user--first {
      width: 45%;
    }

    span:before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: $subscribe-inactive-status-color;
      margin-right: 2px;
    }

    span.dh-referral-user--active:before {
      background-color: $subscribe-active-status-color;
    }
  }
}
</style>