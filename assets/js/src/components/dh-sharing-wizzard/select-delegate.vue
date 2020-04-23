<template>
  <div class="dh-wizard-step dh-select-delegate">
    <div class="dh-wizard-step-body">
      <template v-if="delegates !== null">
        <div class="dh-delegate-add-step">
          <div class="dh-delegate-add-input">
            <input class="dh-input" @input="error = ''" @keypress.enter="addDelegate" v-model="newDelegateEmail" placeholder="Enter new delegate user email and press 'add'">
          </div>
          <div class="dh-dialog-error" v-if="error">
            {{error}}
          </div>
        </div>
        <div class="dh-list-item" v-for="delegate in delegates" :key="delegate.id">
          <div class="dh-delegate-item">
            <div class="dh-delegate-name">
              <email />
              {{delegate.username}}
            </div>
            <button
              class="dh-button dh-small"
              :class="{'dh-loading': loading[delegate.id]}"
              @click="setDelegate(delegate)"
            >{{ delegate.igAccounts.find(i => i.id === account.id) ? "Edit" : "Share"}}</button>
          </div>
        </div>
      </template>
      <template v-else>
        <loader />
      </template>
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-reset-button" @click="$emit('close-wizzard')">Close</button>
      <button class="dh-button" :class="{'dh-loading': loading.search }" :disabled="!newDelegateEmail" @click="addDelegate">Add</button>
    </div>
  </div>
</template>

<script>
import email from "../../assets/email.svg";
import loader from "../dh-loader";
import axios from "axios";
import Vue from "vue";

export default {
  props: ["delegates", "account"],

  data: () => {
    return {
      loading: {},
      newDelegateEmail: "",
      error: ""
    };
  },

  components: {
    email,
    loader
  },

  methods: {
    addDelegate() {
      const { newDelegateEmail, delegates, loading } = this;
      this.error = "";

      Vue.set(loading, "search", true);

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/delegate`,
        method: "post",
        data: {
          email: newDelegateEmail
        }
      }).then(({ data }) => {
          const { dhAccount } = data.response.body;

          delegates.push(dhAccount);
      }).catch(({ response }) => {
          const { statusMessage } = response.data.request;

          this.error = statusMessage;
      }).finally(() => {
          Vue.set(loading, "search", false);
      });
    },

    setDelegate(delegate) {
      const { loading, account } = this;

      Vue.set(loading, delegate.id, true);
      
      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/ig_account/${account.id}/user/${delegate.id}/permissions`
      }).then(({ data }) => {
          const { account } = data.response.body.data;

          this.$emit("set-delegate", delegate, account);
      }).finally(() => {
          Vue.set(loading, delegate.id, false);
      });
    }
  }
};
</script>

<style lang="scss">
div.dh-wizard-step.dh-select-delegate {
  .dh-delegate-add-step {
    margin-bottom: 10px;

    .dh-delegate-add-input input {
      width: 100%;
    }

    .dh-dialog-error {
      height: 40px;
      margin-bottom: 20px;
    }
  }

  .dh-delegate-path {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .dh-delegate-path__assignment {
      text-decoration: none;
    }
  }

  .dh-delegate-item {
    display: flex;
    align-items: center;
    width: 100%;

    .dh-delegate-name {
      flex-grow: 1;
      display: flex;
      align-items: center;

      svg {
        width: 20px;
        color: $textColor;
        margin-right: 15px;
      }
    }
  }

  .dh-list-item {
    cursor: unset;
    height: 48px;
  }
}
</style>