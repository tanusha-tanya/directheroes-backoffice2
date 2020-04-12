<template>
  <div>
    <div class="dh-affiliate-row dh-affiliate-links" v-if="settings">
      <div class="dh-affiliate-column">
        <dh-affiliate-card
          class="dh-affiliate-paypal-card"
          title="Affiliate payouts"
          subtitle="We will send affiliate payouts via Paypal to this email address:"
        >
          <template v-slot:icon>
            <paypal />
          </template>
          <template v-slot:body>
            <div class="dh-input-button-group">
              <dh-input
                v-model="settings.payoutEmail"
                @input="payoutEmailChanged = true"
                @keypress.enter.native="onSavePayouts"
              />
              <dh-button :disabled="!canSave" @click="saveAffiliateInfo" :loading="saving">save</dh-button>
            </div>
            <div
              class="dh-input-button-group"
              v-if="payoutEmailChanged"
            >
              <dh-input
                label="Repeat email to confirm"
                v-model="repeatEmail"
                @keypress.enter.native="onSavePayouts"
              >
                <template v-slot:suffix v-if="canSave">
                  <success />
                </template>
              </dh-input>
              <dh-button :style="{ visibility: 'hidden' }" />
            </div>
          </template>
          <template v-slot:footer>
            <warning-circle />
            <span>Payouts will be made on the first of each month.</span>
          </template>
        </dh-affiliate-card>
      </div>
      <div class="dh-affiliate-column">
        <dh-affiliate-card
          class="dh-affiliate-referrals-card"
          title="Your referral link"
          subtitle="Use this link for all referrals"
        >
          <template v-slot:icon>
            <referrals />
          </template>
          <template v-slot:body>
            <dh-input
              class="dh-affiliate-referrals-link"
              v-model="settings.referrerCode"
              @input="referralClean"
              :maxlength="25"
            >
              <template v-slot:prepend>
                <span class="dh-affiliate-referrals__prefix">{{ dh.apiUrl }}/check-out/?ref=</span>
              </template>
            </dh-input>
            <div class="dh-affiliate-referals-actions">
              <dh-button
                v-if="referrerCodeChanged"
                :loading="saving"
                :disabled="!settings.referrerCode"
                @click="saveAffiliateInfo"
              >Save</dh-button>
              <el-popover
                v-model="successPopover"
                placement="bottom-end"
                width="234"
                trigger="click"
                v-else
              >
                <div class="dh-notify-success">
                  <dhCopy />
                  <span>Copied to clipboard</span>
                  <dhClose class="dh-notify-close" @click="successPopover = false" />
                </div>
                <dh-button slot="reference" @click="copyRefLink">
                  <dhCopy />
                  <span class="dh-affiliate-referrals__copy">copy link</span>
                </dh-button>
              </el-popover>
            </div>
          </template>
        </dh-affiliate-card>
      </div>
    </div>
    <loader v-else />
  </div>
</template>

<script>
import loader from "../dh-loader";
import axios from "axios";
import utils from "../../../oldJS/utils";
import paypal from "../../assets/paypal.svg";
import warningCircle from "../../assets/warning-circle.svg";
import success from "../../assets/success.svg";
import referrals from "../../assets/referrals.svg";
import dhAffiliateCard from "./affiliate-card";
import dhCopy from "../../assets/copy.svg";
import dhClose from "../../assets/close.svg";

export default {
  components: {
    loader,
    paypal,
    warningCircle,
    success,
    referrals,
    dhAffiliateCard,
    dhCopy,
    dhClose
  },

  props: ["settings"],

  data: () => ({
    payoutEmailChanged: false,
    referrerCodeChanged: false,
    repeatEmail: "",
    saving: false,
    successPopover: false
  }),

  computed: {
    dh() {
      return window.dh;
    },

    isSameEmails() {
      const { settings, repeatEmail } = this;

      return settings.payoutEmail === repeatEmail;
    },

    canSave() {
      const { settings, isSameEmails } = this;

      return settings.payoutEmail && isSameEmails;
    }
  },

  methods: {
    onSavePayouts() {
      const { canSave, saveAffiliateInfo } = this;

      if (!canSave) return;

      saveAffiliateInfo();
    },

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
        this.repeatEmail = "";
        this.referrerCodeChanged = false;
        this.saving = false;
      });
    },

    copyRefLink() {
      const { referrerCode } = this.settings;

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

<style lang="scss">
$affiliate-links-icon-size: 53px;
$affiliate-links-referrals-link-color: $link;

$affiliate-email-repeat-success: $secondary2;

$affiliate-footer-warning-icon-size: 24px;
$affiliate-footer-warning-icon-color: $link;

.dh-affiliate-row.dh-affiliate-links .dh-affiliate-column {
  .dh-affiliate-paypal-card {
    .dh-affiliate-card-body {
      svg {
        width: 18px;
        max-height: 18px;
        color: $affiliate-email-repeat-success;
        position: relative;
        top: 14px;
      }
    }

    .dh-affiliate-card-footer {
      color: $affiliate-footer-warning-icon-color;
      font-weight: 500;
      display: flex;
      align-items: center;
      margin-top: 25px;

      svg {
        width: $affiliate-footer-warning-icon-size;
        max-height: $affiliate-footer-warning-icon-size;
      }

      span {
        padding-left: 8px;
      }
    }
  }

  .dh-affiliate-referrals-card {
    .dh-affiliate-card-header__icon svg {
      padding: 5px;
      width: $affiliate-links-icon-size;
      max-height: $affiliate-links-icon-size;
      top: 0;
    }

    .dh-affiliate-card-body {
      .dh-input input {
        height: 45px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .dh-affiliate-referrals__prefix {
        position: relative;
        color: $secondaryDark2;
      }

      .el-input--prefix .el-input__inner {
        padding-left: 260px;
      }

      svg {
        width: 18px;
        max-height: 18px;
      }

      .dh-affiliate-referrals__copy {
        padding-left: 6px;
      }
    }
  }

  .dh-affiliate-referals-actions {
    display: flex;
    justify-content: flex-end;

    .dh-button {
      min-width: 128px;
    }
  }
}
</style>