<template>
   <el-dialog
    :visible.sync="isShow"
    width="554px"
    append-to-body
    :title="title"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="checkAddAccount"
    class="dh-wizard-dialog"
  >
    <component
      :is="wizardState"
      :account="account"
      :protocol="protocol"
      :is-first-time="isFirstTime"
      @set-account="setAccount"
      @close-wizard="isShow = false"
      @re-login="reloginAccount"
      @set-title="title = $event"
      @first-run="isFirstTime = false"
      ref="cwStep"
      ></component>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import selectAccount from './dh-connection-wizard/select-account'
import enterPassword from './dh-connection-wizard/enter-password'
import successAdded from './dh-connection-wizard/success-added'
import twoFactor from './dh-connection-wizard/two-factor'
import challenge from './dh-connection-wizard/challenge'
import checkpoint from './dh-connection-wizard/checkpoint'
import resetAccount from './dh-connection-wizard/reset-account'

export default {
  data() {
    return {
      title: '',
      accountData: null,
      isFirstTime: true,
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
    resetAccount,
  },

  computed: {
    wizardState() {
      const { account } = this;

      if (!account) {
        this.title = 'Select account'
        return 'selectAccount'
      } else {
        switch (account.connectStep) {
          case 'account.verify_password':
            this.title = 'Enter password'
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
            this.title = 'Retry'
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
    },

    checkAddAccount() {
      const { cwStep } = this.$refs;

      if (cwStep.$vnode.componentOptions.tag == 'selectAccount' && (cwStep.helpStep || cwStep.hasPartners)) {
        this.account = cwStep.accountToAdd
      }
    }
  }
}
</script>
