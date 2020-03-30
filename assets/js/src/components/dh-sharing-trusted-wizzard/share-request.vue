<template>
  <div class="dh-wizzard-step dh-share-request">
    <div class="dh-wizzard-step-body">
      <div class="dh-share-text">
        <div>
          <span>{{ delegate.username }}</span>
        </div>Sended request for share access to account
        <span>{{ account.login }}</span>
      </div>
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-small dh-reset-button" @click="$emit('deny')">Deny</button>
      <button class="dh-button dh-small" :class="{'dh-loading': loading}" @click="onShare">Share</button>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  props: ["delegate", "account"],

  data: () => {
    return {
      loading: false
    }
  },

  methods: {
    onShare() {
      this.loading = true;
      const { account, delegate } = this;
      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/ig_account/${account.id}/user/${delegate.id}/permissions`
      }).then(({ data }) => {
          const { response } = data;
          if (response && response.body) {
            const permissions = response.body.data.account;
            this.$emit('show-permissions', permissions);
          }
        }).finally(() => (this.loading = false));
    }
  }
};
</script>

<style lang="scss">
div.el-dialog__wrapper .dh-wizzard-step.dh-share-request {
  .dh-share-text {
    span {
      font-weight: 500;
      font-size: 16px;
    }
  }

  div.el-dialog__footer {
    justify-content: flex-end;

    .dh-button {
      margin-left: 8px;
    }
  }
}
</style>