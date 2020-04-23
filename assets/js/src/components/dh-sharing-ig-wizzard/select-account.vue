<template>
  <div class="dh-wizard-step dh-select-account-wizard">
    <div class="dh-wizard-step-body">
      <template v-if="igAccounts.length">
        <div
          :class="{'dh-select-account-founded': true, 'dh-select-account-selected': isAccountChecked(delegate, account)}"
          v-for="account in igAccounts"
          :key="account.id"
        >
          <div class="dh-select-account-userpic-wrapper">
            <div
              class="dh-select-account-userpic"
              :style="{ 'background-image': `url(${ account.profilePicUrl })` }"
            ></div>
            <el-tooltip class="element-warning" effect="light" :content="account.fullName">
              <span>{{ account.fullName }}</span>
            </el-tooltip>
          </div>
          <div class="dh-select-account-info">
            <div class="dh-select-account-names">
              <span>@{{account.login}}</span>
            </div>
            <div class="dh-select-account-follows">
              <strong>{{account.followerCount}}</strong> followers
              <strong>{{account.followingCount}}</strong> following
            </div>
          </div>
          <button
            class="dh-button dh-small"
            :class="{'dh-loading': loading[account.id]}"
            @click="setAccount(account)"
          >{{ delegate.igAccounts.find(i => i.id === account.id) ? "Edit" : "Share"}}</button>
        </div>
      </template>
      <div v-else>
        Add Instagram account to delegate it to
        <strong>{{delegate.username}}</strong>
      </div>
    </div>
    <div class="el-dialog__footer">
      <span></span>
      <button class="dh-button" @click="$emit('close-wizzard')">Close</button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";

export default {
  props: ["delegate"],

  data: () => {
    return {
      loading: {}
    };
  },

  computed: {
    igAccounts() {
      const { dhAccount } = this;
      const { accounts } = this.$store.state;

      return accounts.filter(account => account.owner.id === dhAccount.id);
    }
  },

  methods: {
    isAccountChecked(manager, account) {
      const { igAccounts } = manager;

      return igAccounts.find(igAccount => igAccount.id === account.id);
    },

    setAccount(account) {
      const { loading, delegate } = this;

      Vue.set(loading, account.id, true);

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/ig_account/${account.id}/user/${delegate.id}/permissions`
      }).then(({ data }) => {
          const permissions = data.response.body.data.account;

          this.$emit("set-account", account, permissions);
      }).finally(() => {
          Vue.set(loading, account.id, false);
      });
    }
  }
};
</script>

<style lang="scss">
.dh-select-account-wizard {
  .dh-select-account-info {
    margin-right: 20px;
  }

  .dh-select-account-userpic-wrapper {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;

    span {
      white-space: nowrap;
    }

    .dh-select-account-userpic {
      margin-left: 10px;
    }
  }

  .dh-select-account-founded {
    height: 70px;
    margin-top: 0;
    margin-bottom: 5px;
    cursor: unset;

    &.dh-select-account-selected {
      position: relative;

      &:before {
        position: absolute;
        content: "";
        left: 7px;
        top: calc(50% - 5px);
        width: 10px;
        height: 5px;
        border-style: solid;
        border-color: $successColor;
        border-width: 0 0 2px 2px;
        transform: rotate(-45deg);
      }
    }

    .dh-button {
      width: 120px;
    }
  }
}
</style>