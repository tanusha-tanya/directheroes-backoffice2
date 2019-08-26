<template>
  <div class="user-sub-input">
    <div class="user-sub-input-select">
      <el-select :value="element.body.action" @change="changeAction">
        <el-option value="collect" label="Store Email"></el-option>
        <el-option value="webhook" label="Connect to Zapier"></el-option>
      </el-select>
    </div>
    <div class="user-webhook-action" v-if="element.body.action === 'webhook'">
      <input placeholder="Please enter hook URL" v-model="element.body.url" @input="clearStatuses">
      <div :class="[{'status-message': true}, element.body.data.status]">{{statusText || 'Send URL to validation'}}</div>
      <button :class="{ loading }" :disabled="loading || !element.body.url.length" @click="testHookUrl">Send test</button>
    </div>
  </div>
</template>

<script>
import ObjectId from '../../utils/ObjectId';
import Vue from 'vue'
import axios from 'axios'
import { userInputSubscriber, userInputZapier } from '../../elements/userInput';

export default {
  data() {
    return {
      loading: false,
      error: null,
    }
  },

  props: ['elements'],

  computed: {
    element() {
      const { elements } = this;

      return elements.find(element => element.type === 'action');
    },

    statusText() {
      const { element, error } = this;
      const { status } = element.body.data;

      return error || (status == 'fail' && 'Validation URL error' ) || (status == 'success' && 'Validation URL is Ok' ) || null
    }
  },

  methods: {
    changeAction(value) {
      const { element, elements } = this;
      let newElement = userInputSubscriber;

      if (value === 'webhook') {
        newElement = userInputZapier;
      }

      newElement.id = (new ObjectId).toString();

      elements.splice(elements.indexOf(element), 1, newElement)
    },

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
    }
  }
}
</script>

<style lang="scss">
  .user-sub-input {
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    border: 1px solid #D8D8D8;

    .user-sub-input-select {
      padding: 10px;
    }

    .user-webhook-action {
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
  }
</style>