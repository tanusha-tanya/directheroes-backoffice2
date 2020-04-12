<template>
  <div class="dh-referal-analytics">
    <el-tabs class="dh-tab" v-model="activeTab">
      <el-tab-pane class="dh-tab-pane" label="day" name="day">
        <dh-payout-count granularity="day" :referrals="payouts" />
      </el-tab-pane>
      <el-tab-pane class="dh-tab-pane" label="week" name="week">
        <dh-payout-count granularity="week" :referrals="payouts" />
      </el-tab-pane>
      <el-tab-pane class="dh-tab-pane" label="month" name="month">
        <dh-payout-count granularity="month" :referrals="payouts" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dhPayoutCount from "./payout-count";

export default {
  components: {
    dhPayoutCount
  },

  props: ["payouts"],

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