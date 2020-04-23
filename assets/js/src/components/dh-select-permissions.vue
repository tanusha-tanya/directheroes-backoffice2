<template>
  <div class="dh-wizard-step dh-select-permissions">
    <div class="dh-wizard-step-body">
      <div class="dh-select-permissions__title">
        Specify the backoffice sections which will be accessible by {{ delegate.username }}
      </div>
      <div class="dh-dialog-error" v-if="globalError">
        {{ globalError }}
      </div>
      <el-tree
        ref="tree"
        :props="tree.props"
        :data="tree.permissions"
        :default-checked-keys="permissionsChecked"
        check-on-click-node
        node-key="code"
        show-checkbox
        accordion
        :highlight-current="true"
        @check-change="togglePermission"
      ></el-tree>
      <div class="dh-wizard-step-buttons" v-if="accountIsShared">
        <button class="dh-button dh-small" :class="{'dh-loading': loading.revoke}" @click="shareAction('revoke')">Deny access</button>
      </div>
    </div>
    <div class="el-dialog__footer buttons">
      <template v-if="!accountIsShared">
        <button class="dh-button dh-reset-button" @click="$emit('cancel')">Cancel</button>
        <button class="dh-button" :class="{'dh-loading': loading.share}" :disabled="!permissionsChecked.length" @click="shareAction('share')">Share</button>
      </template>
      <template v-else>
          <button class="dh-button dh-reset-button" @click="$emit('cancel')">Cancel</button>
          <button class="dh-button" :class="{'dh-loading': loading.share}" :disabled="!permissionsChecked.length" @click="shareAction('share')">Save</button>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";

export default {
  props: ["account", "delegate", "permissions"],

  data: () => {
    return {
      tree: {
        props: {
          children: "children",
          label: "name"
        },
        permissions: [
          {
            code: 200,
            name: "Campaigns",
            isGranted: false
          },
          {
            code: 300,
            name: "Broadcast",
            isGranted: false
          },
          {
            code: 400,
            name: "Live chat",
            isGranted: false
          },
          {
            code: 500,
            name: "Audience",
            isGranted: false
          }
        ]
      },
      loading: {},
      globalError: ''
    };
  },

  computed: {
    permissionsAccount() {
      const { tree } = this;

      return tree.permissions.map(i => {
        return {
          code: i.code,
          isGranted: i.isGranted
        };
      });
    },

    accountIsShared() {
      const { delegate, account } = this;

      if (!delegate || !account) {
        return false;
      }

      return delegate.igAccounts.find(i => i.id === account.id);
    },

    permissionsChecked() {
      return this.tree.permissions.filter(p => p.isGranted).map(p => p.code);
    }
  },

  created() {
    const { permissions, updateAccountPermissions } = this;

    if (permissions) {
      updateAccountPermissions(permissions);
    }
  },

  methods: {
    shareAction(action) {
      const { delegate, account, loading, permissionsAccount, updateAccountPermissions } = this;
      const isRevoke = action === "revoke";
      const igAccount = delegate.igAccounts.find(ig => ig.id === account.id);
      this.globalError = '';
      
      Vue.set(loading, action, true);

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/ig_account/${account.id}/user/${delegate.id}/permissions`,
        method: "post",
        data: {
          account: isRevoke
            ? permissionsAccount.map(p => {
                return {
                  code: p.code,
                  isGranted: false
                }
              }) 
            : permissionsAccount,
          campaigns: []
        }
      }).then(({ data }) => {
          const { body } = data.response;

          updateAccountPermissions(body.data.account);
          if (isRevoke) {
            delegate.igAccounts.splice(delegate.igAccounts.indexOf(igAccount), 1);
          } else {
            if (!igAccount) {
              delegate.igAccounts.push(account);
            }
          }

          this.$emit('select-permissions-action', action, this.tree.permissions);
      }).catch(({ response }) => {
        const { statusMessage } = response.data.request;

        this.globalError = statusMessage;
      }).finally(() => {
        Vue.set(loading, action, false);
      });
    },

    togglePermission(data, checked) {
      this.globalError = '';

      const node = this.tree.permissions.find(p => p.code === data.code);
      if (node) {
        node.isGranted = checked;
      }
    },

    updateAccountPermissions(permissions) {
      if (permissions) {
        const { tree } = this.$refs;

        permissions.forEach(ap => {
          const per = this.tree.permissions.find(p => p.code === ap.code);
          if (per) {
            per.isGranted = ap.isGranted;
          }
          if (tree) {
            tree.setChecked(ap.code, ap.isGranted);
          }
        })
      };
    }
  },

  watch: {
    permissions(newVal, oldVal) {
      this.updateAccountPermissions(newVal);
    }
  }
};
</script>

<style lang="scss">
div.dh-select-permissions {
  .dh-wizard-step-buttons {
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .dh-dialog-error {
    height: 40px;
    margin-bottom: 20px;
  }

  .dh-select-permissions__title {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .el-tree {
    padding: 16px;
    border-radius: 5px;
    border: 1px solid $borderColor;
    max-height: 300px;
    overflow: auto;
  }
}
</style>