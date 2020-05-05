<template>
  <div class="dh-referral-count">
    <div class="dh-referral-indicator">
      <div class="dh-referral-indicator__title">{{ titleTotal }}</div>
      <div class="dh-referral-indicator__body">
        Total referrals
        <!-- <span class="dh-referral-indicator__marker"></span> -->
      </div>
    </div>
    <div class="dh-referral-indicator">
      <div class="dh-referral-indicator__title">{{ titleActive }}</div>
      <div class="dh-referral-indicator__body">
        Active referrals
        <!-- <span
          class="dh-referral-indicator__marker dh-referral-indicator__marker--secondary"
        ></span> -->
      </div>
    </div>
    <div class="dh-referral-indicator dh-referral-indicator--last">
      <!-- <div class="dh-referral-indicator__title">{{ titleNew }}</div>
      <div class="dh-referral-indicator__body">
        New referrals
        <span
          class="dh-referral-indicator__marker dh-referral-indicator__marker--link"
        ></span>
      </div> -->
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: ["granularity", "referrals"],

  computed: {
    referralsWithGranularity() {
      const { granularity, referrals } = this;
      const begin = moment(new Date()).subtract(1, granularity);
      const end = moment();

      return referrals.filter(referral => {
        const date = moment(referral.referredUserJoinedAt * 1000);

        return date.isBetween(begin, end);
      });
    },

    titleTotal() {
      const { referrals } = this;

      return referrals.length;
    },

    titleActive() {
      const { referrals } = this;

      return referrals.filter(referral => referral.referredUserIsSubscribed).length;
    },

    titleNew() {
      const { referralsWithGranularity } = this;

      return referralsWithGranularity.filter(referral => referral.referredUserIsSubscribed).length;
    }
  }
};
</script>

<style lang="scss">
$marker-color-default: $primary;
$marker-color-secondary: $secondary2;
$marker-color-link: $link;
$indicator-title-font-size: $font-size-heading-h1;

.dh-referral-count {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  padding-top: 8px;

  .dh-referral-indicator {
    flex-grow: 1;
    min-width: 100px;

    .dh-referral-indicator__title {
      font-size: $indicator-title-font-size;
      line-height: 36px;
    }
  }

  .dh-referral-indicator__body {
    display: flex;
    align-items: center;

    .dh-referral-indicator__marker {
      background-color: $marker-color-default;
      width: 20px;
      height: 3px;
      margin: 2px 0 0 8px;
    }

    .dh-referral-indicator__marker--secondary {
      background-color: $marker-color-secondary;
    }

    .dh-referral-indicator__marker--link {
      background-color: $marker-color-link;
    }
  }
}
</style>