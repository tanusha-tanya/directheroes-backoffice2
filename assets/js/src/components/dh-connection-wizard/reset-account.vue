<template>
  <div class="dh-wizard-step dh-reset-account">
    <div class="dh-wizard-step-body">
      It didn't work! Connection process might take a bit longer than usual: we need to start over and try an alternative method. Please be patient, it's a variation of a normal connection process. Sometimes you might need to start over up to 3 times
    </div>
    <div class="el-dialog__footer">
      <button :class="{'dh-button': true, 'dh-loading': reseting}" :disabled="reseting" @click="resetSession">Start over</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return {
      reseting: false,
      error: null,
    }
  },

  props: ['account', 'protocol'],

  methods: {
    resetSession() {
      const { account, protocol } = this;

      this.reseting = true;
      this.error = null;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/${ protocol }/session/reset`,
        method: 'post',
        data: {
          accountId: account.id
        }
      }).then(({ data }) => {
        const { request, response } = data;
        const { account } = response.body;

        this.reseting = false;

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

        this.reseting = false;
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
