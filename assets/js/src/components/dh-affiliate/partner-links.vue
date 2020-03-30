<template>
  <div class="dh-partner-row dh-affiliate-info dh-partner-links">
    <div class="dh-affiliate-column">
      <div>We will send one-time link to:</div>
      <div
        class="dh-notification dh-notification-error"
        :class="{ 'dh-notification-visible': errors.global || errors.email }"
      >
        <warning />
        {{errors.global || errors.email}}
      </div>
      <div class="dh-affiliate-actions">
        <input
          type="text"
          class="dh-input dh-input-validation"
          :class="{ 'dh-input-error': errors.email }"
          placeholder="Enter Receiver Email"
          v-model="receiverEmail"
          @input="clearError('email')"
          @keypress.enter="onCreateLink"
        />
        <div
          :class="{'dh-partner-link-wrapper': true, 'dh-partner-link-wrapper-visible': partnerLink}"
        >
          <div class="dh-partner-link">{{ partnerLink }}</div>
        </div>
        <div class="dh-affiliate-actions__buttons">
          <button
            class="dh-button dh-small dh-button-generate"
            :class="{'dh-loading': creating}"
            @click="onCreateLink"
            :disabled="!receiverEmail"
          >Generate</button>
          <button class="dh-button dh-small" :disabled="!partnerLink" @click="copyToClipboard">
            <dh-link />
          </button>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import dhLink from "../../assets/link.svg";
import axios from "axios";
import utils from "../../../oldJS/utils";
import warning from "../../assets/warning.svg";
import Vue from "vue";

export default {
  components: {
    dhLink,
    warning
  },

  data: () => {
    return {
      receiverEmail: null,
      partnerLink: null,
      errors: {
        global: "",
        email: ""
      },
      creating: false
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
          const { response } = data;
          if (response && response.body) {
            const { invitationLink } = response.body;
            this.partnerLink = invitationLink;
          }
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
.dh-affiliate-view .dh-partner-links {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .dh-affiliate-column {
    flex: 0 50%;

    .dh-affiliate-actions {
      display: flex;
      flex-direction: column;
      max-width: 300px;
      margin: 0 auto;

      .dh-affiliate-actions__buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .dh-button-generate {
          flex-grow: 1;
          margin-right: 5px;
        }
      }

      .dh-partner-link-wrapper {
        display: flex;
        align-items: center;
        opacity: 0;
        min-height: 48px;
      }

      .dh-partner-link-wrapper-visible {
        opacity: 1;
      }

      .dh-partner-link {
        color: $elementActiveColor;
        word-break: break-all;
      }

      .dh-button:not(.dh-link-button) {
        margin-top: 10px;
        margin-left: 0;
      }
    }

    .dh-button:not(:disabled) {
      cursor: pointer;
    }

    .dh-notification {
      margin-top: 5px;
      opacity: 0;
    }

    .dh-notification-visible {
      opacity: 1;
    }
  }
}
</style>