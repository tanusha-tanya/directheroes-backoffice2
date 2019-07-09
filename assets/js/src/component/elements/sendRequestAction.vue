<template>
  <div class="request-action">
    <input placeholder="Please enter hook URL" v-model="element.value.url" @input="clearStatuses">
    <div :class="[{'status-message': true}, element.value.status]">{{statusText || 'Send URL to validation'}}</div>
    <button :class="{ loading }" :disabled="loading || !element.value.url.length" @click="testHookUrl">Send test</button>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'

export default {
  data() {
    const { status } =  this.element.value

    return {
      loading: false,
      statusText: (status == 'fail' && 'Validation URL error' ) || (status == 'success' && 'Validation URL is Ok' ) || null,
      isOk: null
    }
  },

  props:['element'],

  methods: {
    clearStatuses() {
      const { value } = this.element;

      this.statusText = null;
      value.status = null;
    },

    testHookUrl() {
      const { value } =  this.element

      this.loading = true
      this.statusText = null
      value.status = null;

      axios({
        url: `${ dh.apiUrl }/api/2.0.0/${ dh.userName }/campaign/send-request`,
        method: 'POST',
        data: value,
      }).then(({ data }) => {
        this.loading = false

        this.statusText = 'Validation URL is Ok'

        Vue.set(value, 'status', 'success')
      }).catch(error => {
        const { response } = error

        if (!response) {
          this.statusText = 'Server error, try later'
        } else {
          this.statusText = response.data.request.statusMessage
        }

        Vue.set(value, 'status', 'fail')

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

  .status-message {
    margin-top: 10px;
    color: #A9A9A9;

    &.fail {
      color: #f44336;
    }

    &.success {
      color: #67c23a;
    }
  }
}
</style>
