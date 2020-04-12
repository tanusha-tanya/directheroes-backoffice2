<template>
  <div class="dh-referal-analytics">
    <el-tabs class="dh-tab" v-model="activeTab">
      <el-tab-pane class="dh-tab-pane" name="day">
        <dh-referral-count granularity="day" :referrals="referrals" />
      </el-tab-pane>
      <!-- <el-tab-pane class="dh-tab-pane" label="week" name="week">
        <dh-referral-count granularity="week" :referrals="referrals" />
      </el-tab-pane>
      <el-tab-pane class="dh-tab-pane" label="month" name="month">
        <dh-referral-count granularity="month" :referrals="referrals" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import dhReferralCount from "./referral-count";

export default {
  components: {
    dhReferralCount
  },

  props: ["referrals"],

  data: () => {
    return {
      activeTab: "day"
    };
  }
};
</script>

<style lang="scss">
.dh-referal-analytics {
  .el-tabs__nav-scroll {
    display: flex;
    justify-content: flex-end;
  }
}
</style>