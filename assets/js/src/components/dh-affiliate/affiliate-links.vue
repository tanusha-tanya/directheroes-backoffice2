<template>
  <div>
    <div class="dh-affiliate-row dh-affiliate-info" v-if="settings">
      <div class="dh-affiliate-column">
        <div>We will send affiliate payouts via Paypal to:</div>
        <div>
          <input
            type="text"
            class="dh-input"
            placeholder="Enter Paypal Email"
            v-model="settings.payoutEmail"
            @input="payoutEmailChanged = true"
          />
          <button
            v-if="payoutEmailChanged"
            :class="{'dh-button':true, 'dh-small':true, 'dh-loading':saving}"
            :disabled="!settings.payoutEmail"
            @click="saveAffiliateInfo"
          >Save</button>
        </div>
        <div>Payouts will be made on the first of each month.</div>
      </div>
      <div class="dh-affiliate-column">
        <div>Your referral link:</div>
        <div class="dh-affiliate-link">
          {{dh.apiUrl}}/check-out/?ref=
          <input
            type="text"
            class="dh-input"
            @input="referralClean"
            v-model="settings.referrerCode"
          />
          <button
            v-if="referrerCodeChanged"
            :class="{'dh-button':true, 'dh-small':true, 'dh-loading':saving}"
            :disabled="!settings.referrerCode"
            @click="saveAffiliateInfo"
          >Save</button>
          <button v-else class="dh-button dh-small dh-link-button" @click="copyRefLink">
            <dh-link />
          </button>
        </div>
        <div>Please use this for all referrals.</div>
      </div>
    </div>
    <loader v-else />
  </div>
</template>

<script>
import dhLink from "../../assets/link.svg";
import loader from "../dh-loader";
import axios from "axios";
import utils from "../../../oldJS/utils";

export default {
  components: {
    dhLink,
    loader
  },

  props: ["settings"],

  data: () => ({
    payoutEmailChanged: false,
    referrerCodeChanged: false,
    saving: false
  }),

  computed: {
    dh() {
      return window.dh;
    }
  },

  methods: {
    saveAffiliateInfo() {
      const { referrerCode, payoutEmail } = this.settings;
      this.saving = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/affiliate/save-settings`,
        method: "post",
        data: {
          affiliateCode: referrerCode,
          payoutEmail
        }
      }).then(({ data }) => {
        this.payoutEmailChanged = false;
        this.referrerCodeChanged = false;
        this.saving = false;
      });
    },

    copyRefLink() {
        utils.copyToClipboard(`${dh.apiUrl}/check-out/?ref=${referrerCode}`);
    },

    referralClean(event) {
      const { settings } = this;
      this.referrerCodeChanged = true;

      settings.referrerCode = settings.referrerCode.replace(
        /[^A-Za-z0-9._]*/g,
        ""
      );
      // console.log(event.target.value.replace(/[^0-9]*/g, ''));
      // event.target.value = event.target.value.replace(/[^0-9]*/g, '')
    }
  }
};
</script>

<style scoped>
</style>