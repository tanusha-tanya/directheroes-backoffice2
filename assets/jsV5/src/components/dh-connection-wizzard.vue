<template>
   <el-dialog
    :visible.sync="isShow"
    width="554px"
    append-to-body
    :title="title"
    class="dh-wizzard-dialog"
  >
    <component :is="wizzardState" @set-account="setAccount" :account="account" @close-wizzard="isShow = false"></component>
  </el-dialog>
</template>

<script>
import selectAccount from './dh-connection-wizzard/select-account'
import enterPassword from './dh-connection-wizzard/enter-password'
import successAdded from './dh-connection-wizzard/success-added'
import challenge from './dh-connection-wizzard/challenge'

export default {
  data() {
    return {
      title: '',
      accountData: null
    }
  },

  props: ['value', 'accountAuth'],

  components: {
    selectAccount,
    enterPassword,
    successAdded,
    challenge
  },

  computed: {
    wizzardState() {
      const { account } = this;

      if (!account) {
        this.title = 'Select account'
        return 'selectAccount'
      } else if (account.igChallenge) {
        this.title = 'Challenge'
        return 'challenge'
      } else if (!account.isLoggedIn) {
        this.title = 'Enter password'
        return 'enterPassword'
      } else {
        this.title = 'Success'
        return 'successAdded'
      }
    },

    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    },

    account: {
      get() {
        const { accountAuth, accountData } = this;

        return accountAuth || accountData;
      },

      set(value) {
        this.$emit('set-auth-account', value)
      }
    }
  },

  methods: {
    setAccount(account) {
      this.account = account;
    }
  }
}
</script>

<style lang="scss">
div.dh-wizzard-dialog {
  .el-dialog__body {
    padding: 0 !important;
  }

  .dh-wizzard-step-body {
    padding: 28px 31px 22px 24px;
    min-height: 200px;
  }

  .el-dialog__footer {
    background-color: #ffffff;
    justify-content: flex-end;
    min-height: 64px;
  }

  .dh-wizzard-error, .dh-wizzard-success {
    height: 80px;
    width: 100%;
    background-color: #FE4D97;
    border-radius: 4px;
    margin-top: 20px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 16px;
  }

  .dh-wizzard-success {
    background-color: $successColor;
  }
}
</style>