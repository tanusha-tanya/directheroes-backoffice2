<template>
  <el-dialog
    :visible.sync="isVisible"
    width="554px"
    append-to-body
    :title="title"
    @close="isVisible = false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    class="dh-wizzard-dialog dh-sharing-ig"
  >
    <component 
      :is="wizzardState" 
      :account="accountState.account" 
      :delegate="delegateShare"
      :permissions="accountState.permissions"
      @close-wizzard="isVisible = false"
      @set-account="accountSet"
      @cancel="accountState.state = 'share.select-account'"
      @to-change-permissions="accountState.state = 'share.permissions'"
      @select-permissions-action="onSelectPermissionAction"
      @success="accountState.state = 'share.select-account'"
    ></component>
  </el-dialog>
</template>

<script>
import selectAccount from "./dh-sharing-ig-wizzard/select-account";
import selectPermissions from "./dh-select-permissions";
import successEdit from "./dh-sharing-wizzard/success-edit";
import Vue from "vue";
import axios from "axios";

export default {
  components: {
    successEdit,
    selectAccount,
    selectPermissions
  },

  props: ["value", "delegateShare"],

  data: () => {
    return {
      title: null,
      accountState: {
        state: null,
        account: null,
        permissions: null
      }
    };
  },

  watch: {
    value(newVal, oldVal) {
      if (!newVal) {
        this.accountState.state = null;
      }
    }
  },

  computed: {
    isVisible: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },

    account() {
      const { accountShare, accountState } = this;

      return { ...accountShare, ...accountState };
    },

    wizzardState() {
      const { account, delegateShare, isVisible } = this;
      if (!isVisible) return;

      if (!account.state) {
        account.state = "share.select-account";
      }

      switch (account.state) {
        case "share.select-account": {
          this.title = "Instagram accounts delegate";
          return "selectAccount";
        }
        case "share.permissions": {
          this.title = `Set permissions`;
          return "selectPermissions";
        }
        case "share.share": {
          this.title = "Permissions saved";
          return "successEdit";
        }
        case "share.revoke": {
          this.title = "Permissions saved";
          return "successEdit";
        }
      }
    }
  },

  methods: {
    accountSet(account, permissions) {
      const { accountState } = this;

      const ext = {
        state: "share.permissions",
        account,
        permissions
      };

      this.accountState = { ...accountState, ...ext };
    },

    onSelectPermissionAction(state, permissions) {
      const { accountState } = this;

      const ext = {
        state: `share.${state}`,
        permissions
      };

      this.accountState = { ...accountState, ...ext };
    }
  }
};
</script>

<style lang="scss">
div.el-dialog__wrapper.dh-wizzard-dialog {
  .dh-button {
    cursor: pointer;
    margin-left: 8px;
  }
}
</style>