<template>
  <el-dialog
    :visible.sync="isVisible"
    width="554px"
    append-to-body
    :title="title"
    @close="isVisible = false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    class="dh-wizzard-dialog dh-trusted-share-access"
  >
    <component
      :is="wizzardState"
      :account="accountShare"
      :delegate="delegateShare"
      :permissions="accountState.permissions"
      @close-wizzard="isVisible = false"
      @deny="accountState.state = 'share.deny'"
      @cancel="accountState.state = 'share.request'"
      @to-change-permissions="accountState.state = 'share.permissions'"
      @select-permissions-action="onSelectPermissionAction"
      @show-permissions="permissionsSet"
    ></component>
  </el-dialog>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import shareRequest from "./dh-sharing-trusted-wizzard/share-request";
import shareDeny from "./dh-sharing-trusted-wizzard/share-deny";
import selectPermissions from "./dh-select-permissions";
import successEdit from './dh-sharing-wizzard/success-edit'

export default {
  components: {
    shareRequest,
    shareDeny,
    selectPermissions,
    successEdit
  },

  props: ["value", "accountShare", "delegateShare"],

  data: () => {
    return {
      title: null,
      accountState: {
        state: null,
        delegate: null,
        permissions: null
      }
    };
  },

  watch: {
    delegateShare(newVal, oldVal) {
      this.accountState.delegate = newVal;
    },

    value(newVal, oldVal) {
      if (!newVal) {
        this.accountState.state = null;
      }
    }
  },

  methods: {
    permissionsSet(permissions) {
      const ext = {
        state: "share.permissions",
        permissions
      };
      this.accountState = { ...this.accountState, ...ext };
    },

    onSelectPermissionAction(state, permissions) {
      const { accountState } = this;
      const ext = {
        state: `share.${state}`,
        permissions
      };
      this.accountState = { ...accountState, ...ext };
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
      const { account } = this;

      if (!account.state) {
        account.state = "share.request";
      }

      switch (account.state) {
        case "share.request": {
          this.title = "Access request";
          return "shareRequest";
        }
        case "share.deny": {
          this.title = `Request deny for ${account.delegate.username}`;
          return "shareDeny";
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
  }
};
</script>

<style lang="scss">
div.dh-wizzard-dialog.dh-trusted-share-access {
  .dh-button {
    cursor: pointer;
    width: 100px;
  }
}
</style>