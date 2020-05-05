<template>
  <div class="dh-affiliate-row dh-partner">
    <div class="dh-affiliate-column">
      <dh-affiliate-card
        class="dh-affiliate-partner-card"
        title="Partner link generation"
        subtitle="We will generate a one-time link that can be used to give you access to user's account."
        :icon="true"
      >
        <template v-slot:icon>
          <dhLink />
        </template>
        <template v-slot:body>
          <div class="dh-input-button-group dh-input-button-group--labeled">
            <dh-input
              label="Receiver's email"
              placeholder="Enter email"
              v-model="receiverEmail"
              @input="() => {
                clearError('email');
                partnerLink = '';
              }"
              @keypress.enter.native="onCreateLink"
              :error="errors.email || errors.global"
            />
            <dh-button
              :disabled="!receiverEmail"
              @click="onCreateLink"
              :loading="creating"
            >generate</dh-button>
          </div>
        </template>
        <template v-slot:footer v-if="partnerLink">
          <div class="dh-partner-success-link">
            <dh-send-outline />
            <span>Partner link has been generated and sent to the receiver</span>
          </div>
          <div class="dh-partner-footer-copy dh-input-button-group dh-input-button-group--labeled">
            <dh-input
              label="You can also copy the link and send it manually:"
              :value="partnerLink"
            />
            <el-popover v-model="successPopover" placement="bottom-end" width="234" trigger="click">
              <div class="dh-notify-success">
                <dhCopy />
                <span>Copied to clipboard</span>
                <dhClose class="dh-notify-close" @click="successPopover = false" />
              </div>
              <dh-button slot="reference" @click="copyToClipboard">
                <dhCopy />
                <span class="dh-partner-copy-icon">copy</span>
              </dh-button>
            </el-popover>
          </div>
        </template>
      </dh-affiliate-card>
    </div>
    <div class="dh-affiliate-column dh-affiliate-column--hidden"></div>
  </div>
</template>

<script>
import dhLink from "../../assets/link.svg";
import axios from "axios";
import utils from "../../../oldJS/utils";
import warning from "../../assets/warning.svg";
import Vue from "vue";
import dhAffiliateCard from "./affiliate-card";
import dhSendOutline from "../../assets/send-outline.svg";
import dhCopy from "../../assets/copy.svg";
import dhClose from "../../assets/close.svg";

export default {
  components: {
    dhLink,
    warning,
    dhAffiliateCard,
    dhSendOutline,
    dhCopy,
    dhClose
  },

  data: () => {
    return {
      receiverEmail: null,
      partnerLink: null,
      errors: {
        global: "",
        email: ""
      },
      creating: false,
      successPopover: false
    };
  },

  computed: {
    hasError() {
      const { errors } = this;

      return Object.keys(errors).some(error => errors[error]);
    }
  },

  methods: {
    copyToClipboard() {
      utils.copyToClipboard(this.partnerLink);
    },

    clearError(property) {
      this.errors[property] = "";
    },

    onCreateLink() {
      const { receiverEmail, clearError, errors } = this;
      if (!utils.isEmail(receiverEmail)) {
        Vue.set(errors, "email", "Email has incorrect format");
      }
      clearError("global");

      if (this.hasError) {
        return;
      }
      this.creating = true;
      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/partner/generate?email=${receiverEmail}`
      })
        .then(({ data }) => {
          const { invitationLink } = data.response.body;

          this.partnerLink = invitationLink;
        })
        .catch(({ response }) => {
          let message = "Something went wrong";
          if (response && response.data && response.data.request) {
            const { statusMessage } = response.data.request;
            message = statusMessage;
          }
          Vue.set(errors, "global", message);
        })
        .finally(() => (this.creating = false));
    }
  }
};
</script>

<style lang="scss">
$partner-link-icon-color: $primary;
$partner-card-min-height: 214px;
$partner-card-icon-size: 36px;

$partner-footer-border-color: $background1;
$partner-footer-background-color: $white;
$partner-footer-success-background: $secondary2;
$partner-footer-success-text-color: $white;
$partner-footer-text-link-color: $link;

.dh-affiliate-partner-card {
  min-height: $partner-card-min-height;

  .dh-affiliate-card-header .dh-affiliate-card-header__icon {
    color: $partner-link-icon-color;

    svg {
      width: $partner-card-icon-size;
      max-height: $partner-card-icon-size;
      top: 8px;
    }
  }

  .dh-affiliate-card-footer {
    padding-top: 20px;
    background-color: $partner-footer-background-color;
    border-top: 1px solid $partner-footer-border-color;

    .dh-partner-success-link {
      background-color: $partner-footer-success-background;
      border-radius: 4px;
      color: $partner-footer-success-text-color;
      padding: 12px 28px;
      display: flex;
      align-items: center;

      svg {
        width: 24px;
        max-height: 24px;
      }

      span {
        padding-left: 12px;
      }
    }
  }

  .dh-partner-footer-copy {
    padding-top: 15px;

    input {
      color: $partner-footer-text-link-color;
    }

    svg {
      width: 18px;
      max-height: 18px;
    }

    .dh-partner-copy-icon {
      padding-left: 8px;
    }

    .dh-button {
      max-width: 100px;
    }
  }
}
</style>
