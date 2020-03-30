<template>
  <el-dialog
    :visible.sync="isVisible"
    width="554px"
    append-to-body
    :title="title"
    @close="isVisible = false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    class="dh-wizzard-dialog dh-share-access"
  >
    <component
      :is="wizzardState"
      :account="accountShare"
      :delegates="delegates"
      :delegate="accountState.delegate"
      :permissions="accountState.permissions"
      @success="accountState.state = 'share.select'"
      @close-wizzard="isVisible = false"
      @set-delegate="delegateSet"
      @cancel="accountState.state = 'share.select'"
      @to-change-permissions="accountState.state = 'share.permissions'"
      @select-permissions-action="onSelectPermissionAction"
    ></component>
  </el-dialog>
</template>

<script>
import selectDelegate from "./dh-sharing-wizzard/select-delegate"
import selectPermissions from "./dh-select-permissions"
import successEdit from './dh-sharing-wizzard/success-edit'
import Vue from "vue"
import axios from "axios"

export default {
  components: {
    selectDelegate,
    selectPermissions,
    successEdit
  },

  props: ["value", "accountShare", "delegates"],

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
      const { account, isVisible } = this;
      if (!isVisible) return;
      
      if (!account.state) {
        account.state = "share.select";
      }

      switch (account.state) {
        case "share.select": {
          this.title = "Share Instagram account";
          return "selectDelegate";
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
    delegateSet(delegate, permissions) {
      const { accountState } = this;

      const ext = {
        state: "share.permissions",
        delegate,
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
div.dh-wizzard-dialog.dh-share-access {
  .dh-button {
    cursor: pointer;
    margin-left: 8px;
  }
}
</style>