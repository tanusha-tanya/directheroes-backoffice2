<template>
  <div class="dh-wizzard-step dh-enter-password" v-if="!infoViwed">
    <div class="dh-wizzard-step-body">
      Please take your phone, open Instagram app, and reload news feed. Then click “it was me” if you see this prompt:
      <img src="../../assets/it_was_me.png">
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button" @click="viewInfo">Next</button>
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
      <button :class="{'dh-button': true, 'dh-loading': connecting}" :disabled="!password || connecting" @click="setPassword">Connect</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import sodium from 'libsodium-wrappers';

export default {
  data() {
    return {
      password: '',
      connecting: false,
      error: null,
      infoViwed: false,
    }
  },

  props: ['account', 'protocol'],

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

    viewInfo() {
      this.infoViwed = true;
      this.$emit('set-title', 'Enter password')
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

  .dh-button {
    min-width: 100px;
    margin-left: 20px;
  }
}
</style>