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
    }
  },

  computed: {
    affiliateInfoSettings() {
      const { affiliateInfo } = this;

      return (affiliateInfo && affiliateInfo.settings) || null;
    }
  }
};
</script>