<template>
   <el-dialog
    :visible.sync="isShow"
    width="554px"
    append-to-body
    :title="title"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    class="dh-wizzard-dialog"
  >
    <component
      :is="wizzardState"
      :account="account"
      :protocol="protocol"
      @set-account="setAccount"
      @close-wizzard="isShow = false"
      @re-login="reloginAccount"
      @set-title="title = $event"
      ></component>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import selectAccount from './dh-connection-wizzard/select-account'
import enterPassword from './dh-connection-wizzard/enter-password'
import successAdded from './dh-connection-wizzard/success-added'
import twoFactor from './dh-connection-wizzard/two-factor'
import challenge from './dh-connection-wizzard/challenge'
import checkpoint from './dh-connection-wizzard/checkpoint'
import resetAccount from './dh-connection-wizzard/reset-account'

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
    challenge,
    checkpoint,
    twoFactor,
    resetAccount
  },

  computed: {
    wizzardState() {
      const { account } = this;

      if (!account) {
        this.title = 'Select account'
        return 'selectAccount'
      } else {
        switch (account.connectStep) {
          case 'account.verify_password':
            this.title = 'Clear previous attempt' //'Enter password'
            return 'enterPassword'
            break;
          case 'account.success':
            this.title = 'Success'
            return 'successAdded'
            break;
          case 'account.challenge.code_sent':
          case 'account.challenge.request_code':
            this.title = 'Challenge'
            return 'challenge'
          case 'account.checkpoint_required':
            this.title = 'Checkpoint'
            return 'checkpoint'
          case 'account.two_factor.code_sent':
            this.title = 'Two factor authorization'
            return 'twoFactor'
          case 'account.reset':
            this.title = 'Alternative connection'
            return 'resetAccount'
        }
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

        return JSON.parse(JSON.stringify(accountAuth || accountData));
      },

      set(value) {
        this.$emit('set-auth-account', value)
      }
    },

    protocol() {
      const { account } = this;

      return (account && account.currentApiConnect) || 'android'
    }
  },

  methods: {
    setAccount(account) {
      this.account = account;
    },

    reloginAccount(callback) {
      const { account, protocol } = this;
      const request = axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/${ protocol }/relogin`,
        method: 'post',
        data: {
          accountId: account.id
        }
      })

      request.then(({ data }) => {
        const { request, response } = data;
        const { account } = response.body;

        this.account = account;
      })

      callback(request)
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