<template>
  <div class="user-webhook-action">
    <div class="user-webhook-title">
      Please enter hook URL
    </div>
    <input v-model="zapierAction.body.url" @input="clearStatuses">
    <div :class="[{'status-message': true}, zapierAction.body.data.status]" v-if="statusText">{{statusText}}</div>
    <button :class="{ loading }" :disabled="loading || !zapierAction.body.url.length" @click="testHookUrl" v-else>Send test</button>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

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
      const { zapierAction, error } = this;
      const { status } = zapierAction.body.data;

      return error || (status == 'fail' && 'Invalid' ) || (status == 'success' && 'Validated' ) || null
    },

    zapierAction() {
      const { element } = this;

      return element.elements.find(element => element.body.action === 'webhook')
    }
  },

  methods: {
    clearStatuses() {
      const { data } = this.zapierAction.body;

      data.status = null;
      this.error = null;
    },

    testHookUrl() {
      const { data: elementData, url } =  this.zapierAction.body

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
    border: 1px solid #DDDDDD;
    border-radius: 8px;
    padding: 10px;
    font-size: 15px;
    outline: none;

    &::placeholder {
      color: #A9A9A9;
      font: 11px/16px 'Lato';
    }
  }


  button {
    margin-top: 7px;
    width: 100%;
    background-color: #51C99E;
    border-radius: 3px;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    padding: 8px 26px;
    color: #fff;
    cursor: pointer;

    &.loading {
      color: transparent;
      position: relative;

      &:before {
        content: '';
        display: block;
        position: absolute;
        top: calc(50% - 10px);
        left: calc(50% - 10px);
        width: 15px;
        height: 15px;
        border-radius: 100%;
        border: 3px solid #FFF;
        border-bottom-color: transparent;
        animation: rotation  .8s infinite linear;
      }
    }
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