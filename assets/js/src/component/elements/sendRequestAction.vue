<template>
  <div class="request-action">
    <input placeholder="Please enter hook URL" v-model="element.value.url" @input="error = null; isOK = null">
    <div class="error" v-if="error">{{error}}</div>
    <div class="success-status" v-if="isOk">Ok</div>
    <button :class="{ loading }" :disabled="loading || !element.value.url.length" @click="testHookUrl">Send test</button>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      error: null,
      isOk: null
    }
  },

  props:['element'],

  methods: {
    testHookUrl() {
      const { value } =  this.element

      this.loading = true
      this.error = null

      axios({
        url: `${ dh.apiUrl }/api/2.0.0/${ dh.userName }/campaign/send-request`,
        method: 'POST',
        data: value,
      }).then(({ data }) => {
        this.loading = false
        this.isOk = true
      }).catch(error => {
        const { response } = error

        if (!response) {
          this.error = 'Server error, try later'
        } else {
          this.error = response.data.request.statusCode
        }

        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.request-action {
  padding: 9px 20px 13px;
  text-align: center;

  input {
    width: 100%;
  }

  button {
    margin-top: 10px;
  }

  .error {
    color: #f44336;
    margin-top: 10px;
  }

  .success-status {
    color: #67c23a;
    margin-top: 10px;
  }
}
</style>
