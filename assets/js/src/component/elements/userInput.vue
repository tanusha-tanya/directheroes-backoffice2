<template>
  <div class="user-input-items">
    <div class="user-input-select">
      <el-select v-model="inputElement.condition.value">
        <el-option v-for="inputType in inputList" :key="inputType.value" :value="inputType.value" :label="inputType.title"></el-option>
      </el-select>
    </div>
    <div class="user-input-matches">
      <div class="user-input-match" :ref="element.id">
        Collect Email
      </div>
      <div class="user-input-fail" :ref="`${element.id}-fail`">
        Doesn't Collect Email
        <add-step-popup :available-list="availableList" @add-step="createStep(element, $event, true)" v-if="!hasOnFail(element)"></add-step-popup>
      </div>
    </div>
  </div>
</template>

<script>
import elementsPermissions from '../../elements/permissions'
import addStepPopup from '../addStepPopup'
import Vue from 'vue';
import ObjectId from '../../utils/ObjectId';

export default {
  data() {
    return {
      inputList: [{value: '{{email}}', title: 'E-mail'}]
    }
  },

  props: ['elements'],

  components: {
    addStepPopup
  },

  computed: {
    element() {
      const element = this.elements[0];

      return element
    },

    inputElement() {
      const { element } = this;

      return element.elements.find(element => element.type == 'rule')
    },

    availableList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.triggers;
      return elementsPermissions.fromUserInputFails.concat(messageTypes)
    }
  },

  methods: {
    hasOnFail(element) {
      return element.elements.find(element => element.type === 'rule').onFail
    },

    createStep(userInput, element, onFail) {
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

      const matchElement = userInput.elements.find(element => element.type === 'rule');

      Vue.set(matchElement, onFail ? 'onFail' : 'onMatch', {
        action: 'goto',
        target: step.id
      });

      this.$emit('add-step', step);
    }
  }
}
</script>

<style lang="scss">
  .user-input-items {
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    border: 1px solid #D8D8D8;

    .user-input-select {
      padding: 4px 6px;
    }

    .el-select {
      width: 100%;
    }

    .user-input-matches {
      & > div {
        padding: 13px 24px;
        text-align: right;
        font-weight: bold;
      }

      .user-input-fail {
        color: #E06250;
        position: relative;
        border-top: 1px dashed #D8D8D8;
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
</style>