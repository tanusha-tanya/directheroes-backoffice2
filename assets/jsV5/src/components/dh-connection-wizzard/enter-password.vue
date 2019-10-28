<template>
  <div class="dh-wizzard-step dh-enter-password">
    <div class="dh-wizzard-step-body">
      <div class="dh-select-account-controls">
        <input class="dh-input" type="text" v-model="password" placeholder="Enter password"/>
        <button :class="{'dh-button': true, 'dh-loading': connecting}" :disabled="!password || connecting" @click="setPassword">Connect</button>
      </div>
      <div class="dh-wizzard-error" v-if="error">
        {{error}}
      </div>
    </div>
    <div class="el-dialog__footer">
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      password: '',
      connecting: false,
      error: null,
    }
  },

  props: ['account'],

  methods: {
    setPassword() {
      const { account, password } = this;

      this.error = null;
      this.connecting = true;

      account.password = password;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/password/verify`,
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
        const { statusMessage } = error.response.data.request;

        this.error = statusMessage;
        this.connecting = false;
      })
    }
  }
}
</script>

<style lang="scss">
.dh-enter-password {
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