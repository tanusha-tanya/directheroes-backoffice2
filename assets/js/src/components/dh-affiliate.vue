<template>
  <div>
    <template v-if="dhAccount.features.affiliate">
      <el-tabs class="dh-tab" v-model="activeTab">
        <el-tab-pane class="dh-tab-pane" label="analytics" name="analytics">
          <dh-affiliate-analytics :affiliateInfo="affiliateInfo" />
        </el-tab-pane>
        <el-tab-pane class="dh-tab-pane" label="affiliate links" name="affilate">
          <dh-affiliate-links :settings="affiliateInfoSettings" />
        </el-tab-pane>
        <el-tab-pane class="dh-tab-pane" label="partner links" name="partner">
          <dh-affiliate-partner-links />
        </el-tab-pane>
      </el-tabs>
    </template>
    <template v-else>
      <div class="dh-affiliate-template">
        <div class="dh-info">To join our partner program please send your Partners Request below</div>
        <a class="dh-button" href="mailto:hello@directheroes.com" target="_blank">Apply now</a>
      </div>
    </template>
  </div>
</template>

<script>
import dhAffiliateAnalytics from "./dh-affiliate/analytics";
import dhAffiliateLinks from "./dh-affiliate/affiliate-links";
import dhAffiliatePartnerLinks from "./dh-affiliate/partner-links";

export default {
  components: {
    dhAffiliateAnalytics,
    dhAffiliateLinks,
    dhAffiliatePartnerLinks
  },

  props: ["affiliateInfo"],

  data() {
    return {
      activeTab: "analytics"
    };
  },

  computed: {
    affiliateInfoSettings() {
      const { affiliateInfo } = this;

      return (affiliateInfo && affiliateInfo.settings) || null;
    }
  }
};
</script>

<style lang="scss">
.dh-affiliate-template {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
}

$affiliate-column-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);
$affiliate-column-background-color: $white;

$affiliate-column-title-font-size: 20px;
$affiliate-column-title-border-color: $outline;

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
    align-items: flex-start;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &:last-child {
      flex-grow: 1;
    }
  }

  .dh-affiliate-column {
    background-color: $affiliate-column-background-color;
    box-shadow: $affiliate-column-shadow;
    border-radius: 4px;
    flex-grow: 1;
    width: 50%;

    &:not(:last-child) {
      margin-right: 28px;
    }

    .dh-affiliate-column__title {
      font-family: Rubik;
      font-style: normal;
      font-weight: normal;
      font-size: $affiliate-column-title-font-size;
      line-height: 24px;
      min-height: 64px;
      padding: 20px 28px;
      border-bottom: 1px solid $affiliate-column-title-border-color;
    }

    .dh-affiliate-column__body {
      padding: 8px 28px 20px;
    }

    .dh-button {
      margin-left: 10px;
    }
  }
}
</style>