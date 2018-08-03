<template>
  <header>
    <div class="logo">
      Direct Heroes
    </div>
    <div class="account-list">
      <router-link
        :to="{ name: 'accountCurrent', params: { accountId: account.id } }"
        tag="div"
        :class="{ 'account-item': true, active: account === currentAccount }"
        v-for="account in accounts"
        :key="account.id"
      >
        <div class="account-avatar" :style="{'background-image': `url(${ account.avatarURL }), url(${ defaultAvatar })`}"></div>
        {{account.name}}
      </router-link>
      <div class="add-account" @click="addAccount">
        <div class="account-plus-ico">
          +
        </div>
        Add account
      </div>
    </div>
  </header>
</template>
<script>
  import { mapMutations } from 'vuex';
  import defaultAvatar from '../assets/ig-avatar.jpg'

  export default {
    data() {
      return {
        defaultAvatar
      }
    },

    computed: {
      accounts() {
        return this.$store.state.accounts
      },

      currentAccount() {
        return this.$store.state.currentAccount
      }
    },

    methods: {
      ...mapMutations([
        'addAccount'
      ])
    }
  }
</script>
<style lang="scss">
  header {
    display: flex;
    min-height: 50px;
    background-color: #434890;
    color: #fff;

    .logo {
      max-width: 250px;
      width: 100%;
      text-align: center;
      background-color: #31356A;
    }

    .account-list {
      display: flex
    }

    .account-item {
      display: flex;
      border-bottom: 3px solid transparent;
      padding: 0 16px;
      align-items: center;
      cursor: pointer;
      opacity: .5;

      &:hover {
        opacity: .8;
      }

      &.active {
        border-bottom-color: #FFC000;
        position: relative;
        background-color: #38397D;
        cursor: default;
        opacity: 1;

        &:before {
          content: '';
          position: absolute;
          border-width: 7px 5px 0;
          border-color: #FFC000 transparent transparent;
          border-style: solid;
          top: calc(100% + 3px);
          left: calc(50% - 3px);
        }
      }

      .account-avatar {
        width: 32px;
        height: 32px;
        background-position: center;
        background-size: contain;
        border-radius: 50%;
        margin-right: 12px;
      }
    }

    .add-account {
      display: flex;
      align-items: center;
      padding: 0 16px;
      cursor: pointer;
      opacity: .5;

      &:hover {
        opacity: .8;
      }

      .account-plus-ico {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #353579;
        margin-right: 12px;
        padding: 8px;
        text-align: center;
      }
    }
  }
</style>