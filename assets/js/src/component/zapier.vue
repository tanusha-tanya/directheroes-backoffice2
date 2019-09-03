<template>
  <div class="user-webhook-action">
    <div class="user-webhook-title">
      Please enter hook URL
    </div>
    <input v-model="element.body.url" @input="clearStatuses">
    <div :class="[{'status-message': true}, element.body.data.status]" v-if="statusText">{{statusText}}</div>
    <button :class="{ loading }" :disabled="loading || !element.body.url.length" @click="testHookUrl" v-else>Send test</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      error: null,
    }
  },

  props: ['element'],

  computed: {
    statusText() {
      const { element, error } = this;
      const { status } = element.body.data;

      return error || (status == 'fail' && 'Invalid' ) || (status == 'success' && 'Validated' ) || null
    },
  },

  methods: {
    clearStatuses() {
      const { data } = this.element.body;

      data.status = null;
      this.error = null;
    },

    testHookUrl() {
      const { data: elementData, url } =  this.element.body

      this.loading = true
      elementData.status = null;

      axios({
        url: `${ dh.apiUrl }/api/2.0.0/${ dh.userName }/campaign/call-webhook`,
        method: 'POST',
        data: { url, selectedTypes:[] },
      }).then(({ data }) => {
        this.loading = false

        Vue.set(elementData, 'status', 'success')
      }).catch(error => {
        const { response } = error

        if (!response) {
          this.error = 'Server error, try later'
        } else {
          this.error = response.data.request.statusMessage
        }

        Vue.set(elementData, 'status', 'fail')

        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss">
.user-webhook-action {
  padding: 9px 20px 13px;

  .user-webhook-title {
    color: #828282;
    margin-bottom: 3px;
  }

  input {
    width: 100%;
    height: 27px;
    font: 11px/27px 'Lato';
    padding: 0 10px;
  }

  button {
    margin-top: 7px;
    width: 100%;
    background-color: #51C99E;
    border-radius: 3px;
  }

  .status-message {
    margin-top: 5px;
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