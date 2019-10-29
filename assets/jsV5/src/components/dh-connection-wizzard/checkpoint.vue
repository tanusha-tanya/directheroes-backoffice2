<template>
  <div class="dh-wizzard-step dh-checkpoint">
    <div class="dh-wizzard-step-body">
      Open instagram, click “it was me”
    </div>
    <div class="el-dialog__footer">
      <button :class="{'dh-button': true, 'dh-reset-button': true}" :disabled="sending">I didn’t have that prompt</button>
      <button :class="{'dh-button': true, 'dh-loading': sending}" :disabled="sending" @click="relogin">I did that</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return {
      sending: false,
      error: null,
    }
  },

  props: ['account', 'protocol'],

  methods: {
    relogin(event) {
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
    }
  },

  watch: {
    noCodeInfo() {
      this.error = null;
    },
    codeSended() {
      this.error = null;
    }
  }
}
</script>

<style lang="scss">
.dh-checkpoint {
  .el-dialog__footer {
    justify-content: space-between !important;
  }
}
</style>