<template>
  <div class="user-sub-input">
    <div class="user-sub-input-select" :ref="linker && linker.id">
      <el-select :value="element.body.action" @change="changeAction" size="small" popper-class="user-sub-input-dropdown">
        <el-option value="collect" label="Store Email"></el-option>
        <el-option value="webhook" label="Connect to Zapier"></el-option>
      </el-select>
      <add-step-popup
        :available-list="availableList"
        @add-step="createStep"
        v-if="!linker"
      ></add-step-popup>
    </div>
    <div class="user-webhook-action" v-if="element.body.action === 'webhook'">
      <div class="user-webhook-title">
        Please enter hook URL
      </div>
      <input v-model="element.body.url" @input="clearStatuses">
      <div :class="[{'status-message': true}, element.body.data.status]" v-if="statusText">{{statusText}}</div>
      <button :class="{ loading }" :disabled="loading || !element.body.url.length" @click="testHookUrl" v-else>Send test</button>
    </div>
  </div>
</template>

<script>
import ObjectId from '../../utils/ObjectId';
import Vue from 'vue'
import axios from 'axios'
import addStepPopup from '../addStepPopup';
import elementsPermissions from '../../elements/permissions'
import { userInputSubscriber, userInputZapier } from '../../elements/userInput';

export default {
  data() {
    return {
      loading: false,
      error: null,
    }
  },

  components: {
    addStepPopup
  },

  props: ['elements'],

  computed: {
    element() {
      const { elements } = this;

      return elements.find(element => element.type === 'action');
    },

    linker() {
      const { elements } = this;

      return elements.find(element => element.type === 'linker');
    },

    statusText() {
      const { element, error } = this;
      const { status } = element.body.data;

      return error || (status == 'fail' && 'Invalid' ) || (status == 'success' && 'Validated' ) || null
    },

    availableList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.triggers;

      return elementsPermissions.fromUserInput.concat(messageTypes);
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
    },

    createStep(element) {
      const { elements } = this;
      const step = {
        id: (new ObjectId).toString(),
        elements: [
          {
            id: (new ObjectId).toString(),
            ...element
          }
        ]
      }

      if (element.type === 'group') {
        element.elements.forEach(element => {
          element.id = (new ObjectId).toString()
        })
      }

      elements.push({
        id: (new ObjectId).toString(),
        type: 'linker',
        target: step.id
      })

      this.$emit('add-step', step);
    },
  }
}
</script>

<style lang="scss">
  .user-sub-input {
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    border: 1px solid #D8D8D8;

    .user-sub-input-select {
      padding: 10px 20px 10px 10px;
      position: relative;

      .el-select {
        width: 100%;

        .el-select__caret {
          color: #2D2D2D;
        }

        .el-input__inner {
          background-color: #ECECEC;
          color: #2D2D2D;
          border-color: #717FFF
        }
      }
    }

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

    .add-step-button {
      position: absolute;
      right: -14px;
      top: calc(50% - 14px);

      &:after {
        content: '';
        position: absolute;
        top: calc(50% - 1px);
        left: calc(50% - 7px);
        height: 2px;
        background-color: #ccc;
        width: 14px;
      }

      &:before {
        content: '';
        position: absolute;
        top: calc(50% - 7px);
        left: calc(50% - 1px);
        height: 14px;
        background-color: #ccc;
        width: 2px;
      }

      &:hover {
        &:after, &:before {
          background-color: #6A12CB;
        }
      }
    }
  }

  .user-sub-input-dropdown {
    border: 1px solid #717FFF;
    margin-top: -32px !important;
    overflow: hidden;

    .popper__arrow {
      display: none;
    }

    .el-scrollbar__view {
      padding: 0;
    }

    .el-select-dropdown__item, .el-select-dropdown__item.selected {
      font-size: 13px;
      line-height: 26px;
      color: #2D2D2D;
      padding-top: 4px;
      font-weight: normal;
      background-color: #FFF;

      &:hover {
        background-color: #ECECEC;
      }
    }
  }
</style>