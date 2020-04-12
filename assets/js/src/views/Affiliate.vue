<template>
  <div class="dh-view dh-affiliate-view">
    <dh-header title="Partner Program"></dh-header>
    <div class="dh-view-content">
      <dh-affiliate :affiliateInfo="affiliateInfo" />
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import dhHeader from "../components/dh-header";
import dhFooter from "../components/dh-footer";
import loader from "../components/dh-loader";
import dhAffiliate from "../components/dh-affiliate";

export default {
  data() {
    return {
      affiliateInfo: null
    };
  },

  components: {
    dhHeader,
    dhFooter,
    loader,
    dhAffiliate
  },

  created() {
    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/affiliate/report`,
      method: "post"
    }).then(({ data }) => {
      const { settings, report } = data.response.body;
      report.sort((a,b) => b.referredUserJoinedAt - a.referredUserJoinedAt).forEach(
        rep =>
          (rep.referredUserJoinedAt = moment(
            rep.referredUserJoinedAt * 1000
          ).format("DD/MM/YY"))
      );

      this.affiliateInfo = {
        settings,
        report
      };
    });
  }
};
</script>
