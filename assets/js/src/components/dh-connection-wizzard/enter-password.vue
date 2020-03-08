<template>
  <div class="dh-wizzard-step dh-enter-password" v-if="currentState === 'preparation'">
    <div class="dh-wizzard-step-body">
      Who is using this account on mobile?
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-reset-button" @click="currentState = 'preparation-2'">Multiple people</button>
      <button class="dh-button" @click="currentState = 'checkpoint'">Just me</button>
    </div>
  </div>
   <div class="dh-wizzard-step dh-enter-password" v-else-if="currentState === 'preparation-2'">
    <div class="dh-wizzard-step-body">
      Please ask your colleagues not to use the account while you're getting it connected, it might take up to 15 minutes.
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-reset-button" @click="currentState = 'checkpoint'">No one is using it</button>
      <button class="dh-button" @click="$emit('close-wizzard')">It's in use, I have to wait</button>
    </div>
  </div>
  <checkpoint v-else-if="currentState === 'checkpoint'" @re-login="relogin($event)"></checkpoint>
  <div class="dh-wizzard-step dh-enter-password" v-else-if="currentState === 'preparation-3'">
    <div class="dh-wizzard-step-body">
      Do you have two-factor authentication enabled on this account?<br><br>
      <div class="dh-two-factor-radio-list">
        <el-radio v-model="has2fa" :label="1">Yes</el-radio><br>
        <el-radio v-model="has2fa" :label="3">No</el-radio><br>
        <el-radio v-model="has2fa" :label="2">I'm not sure</el-radio>
      </div><br/>
    </div>
    <div class="el-dialog__footer">
      <span></span>
      <button
        class="dh-button"
        :disabled="!has2fa"
        @click="currentState = ''">
        Next
      </button>
    </div>
  </div>
  <div class="dh-wizzard-step dh-enter-password" v-else>
    <div class="dh-wizzard-step-body">
      <div class="dh-select-account-controls">
        <input class="dh-input" type="password" @input="error = null" v-model="password" placeholder="Enter password"/>
      </div>
      <div class="dh-wizzard-error" v-if="error">
        {{error}}
      </div>
    </div>
    <div class="el-dialog__footer">
      <span></span>
      <button :class="{'dh-button': true, 'dh-loading': connecting}" :disabled="!password || connecting" @click="setPassword">Connect</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import sodium from 'libsodium-wrappers'
import checkpoint from './checkpoint';

export default {
  data() {
    const { isFirstTime } = this;

    if (isFirstTime) {
      this.$emit('set-title', 'Preparation')
    }

    return {
      password: '',
      connecting: false,
      has2fa: null,
      error: null,
      infoViwed: false,
      currentState: isFirstTime ? 'preparation' : ''
    }
  },

  props: ['account', 'protocol', 'isFirstTime'],

  components: {
    checkpoint
  },

  methods: {
    setPassword() {
      const { account, password, protocol } = this;
      let publicKey = null;

      Object.keys(sodium.base64_variants).some(variant => {
        try {
          publicKey = sodium.from_base64(this.dhAccount.publicKey, sodium.base64_variants[variant]);
          return true;
        } catch (error) {
          return false
        }
      })

      const cryptedPassword = sodium.to_base64(sodium.crypto_box_seal(password, publicKey), 1);

      this.error = null;
      this.connecting = true;

      account.password = cryptedPassword;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/${ protocol }/password/verify`,
        method: 'post',
        data: {
          account
        }
      }).then(({ data }) => {
        const { request, response } = data;
        const { account } = response.body;

        this.connecting = false;

        if (!request.success) {
          this.error = request.statusMessage;
        } else if (account.igErrorMessage) {
          this.error = account.igErrorMessage;
        }

        this.$emit('set-account', account);
      }).catch(error => {
        const { request } = error.response.data;

        if (request) {
          const { statusMessage } = request;

          this.error = statusMessage;
        } else {
          this.error = "Server connection problem, try again";
        }

        this.connecting = false;
      })
    },

    relogin(callback) {
      this.currentState = 'preparation-3';
      // this.$emit('re-login', (request) => {
      //   callback(request)

      //   request.then(() => {
      //     this.$nextTick(() => {
      //       this.currentState = '';
      //     })
      //   })
      // })
    }
  },

  watch: {
    currentState(newState) {
      if (newState !== 'checkpoint') return;

      this.$emit('set-title', 'Clear previous attempt')
    }
  }
}
</script>

<style lang="scss">
.dh-enter-password {
  img {
    width: 200px;
    display: block;
    margin: 20px auto 0;
  }

  .dh-select-account-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dh-input {
    flex-grow: 1;
  }

  .el-dialog__footer {
    justify-content: space-between !important;
  }
}
</style>