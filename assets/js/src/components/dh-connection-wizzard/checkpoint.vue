<template>
  <div class="dh-wizzard-step dh-checkpoint" v-if="!anyDid">
    <div class="dh-wizzard-step-body">
      Please take your phone, open the Instagram app, and reload news feed. Then click "it was me" if you see this prompt:
      <img src="../../assets/it_was_me.png">
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-reset-button" @click="anyDid = true">I didn’t have that prompt</button>
      <button class="dh-button" @click="anyDid = true">I did that</button>
    </div>
  </div>
  <div class="dh-wizzard-step dh-checkpoint" v-else>
    <div class="dh-wizzard-step-body">
      Please close the Instagram app, and do not open the app or web version till the end of the connection process, unless it's asked by this wizard.
    </div>
    <div class="el-dialog__footer">
      <span></span>
      <button :class="{'dh-button': true, 'dh-loading': sending}" :disabled="sending" @click="relogin">App is closed</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return {
      sending: false,
      anyDid: false,
    }
  },

  methods: {
    relogin() {
      this.sending = true;
      this.error = null;

      this.$emit('re-login', (request) => {
        request.then(({ data }) => {
          const { request, response } = data;
          const { account } = response.body;

          if (!request.success) {
            this.error = request.statusMessage;
          } else if (account.igErrorMessage) {
            this.error = account.igErrorMessage;
          }

          this.sending = false;
        }).catch(error => {
          const { request } = error.response.data;

          if (request) {
            const { statusMessage } = request;

            this.error = statusMessage;
          } else {
            this.error = "Server connection problem, try again";
          }

          this.sending = false;
        })
      })
    },
  },
}
</script>

<style lang="scss">
.dh-checkpoint {
  img {
    width: 200px;
    display: block;
    margin: 20px auto 0;
  }
  .el-dialog__footer {
    justify-content: space-between !important;
  }
}
</style>