<template>
  <div class="condition-items">
    <template v-for="element in elements">
      <div class='condition-timeout' :key="element.id">
        <div class="condition-timeout-title">Timeout</div>
          <div class="condition-timeout-controls">
            <div class="condition-timeout-control">
              IF,<br>
              within: <timeout :element="element"></timeout><br>
              the user:
            </div>
            <div class="condition-timeout-matches">
              <div class="condition-timeout-match" :ref="element.id">
                Reply
                <add-step-popup :available-list="availableList" @add-step="createStep(element, $event)" v-if="!hasOnMatch(element)"></add-step-popup>
              </div>
              <div class="condition-timeout-fail" :ref="`${element.id}-fail`">
                NO Reply
                <add-step-popup :available-list="availableList" @add-step="createStep(element, $event, true)" v-if="!hasOnFail(element)"></add-step-popup>
              </div>
            </div>
          </div>
      </div>
    </template>
    <div class="add-condition-button">
      <add-condition-popup @on-select="addCondition" :available-list="availableConditionList">
        <span>+ Add condition item</span>
      </add-condition-popup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import elementsPermissions from '../../elements/permissions'
import addConditionPopup from '../addConditionPopup';
import addStepPopup from '../addStepPopup';
import timeout from '../timeout';
import ObjectId from '../../utils/ObjectId';
import elementWarning from '../elementWarning'

export default {
  props: ['elements'],

  components: {
    addConditionPopup,
    elementWarning,
    addStepPopup,
    timeout
  },

  computed: {
    availableConditionList() {
      return []
    },

    availableList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.triggers;

      return elementsPermissions.fromCondition.concat(messageTypes)
    }
  },

  methods: {
    addCondition() {

    },

    hasOnMatch(element) {
      return element.elements[2].onMatch
    },

    hasOnFail(element) {
      return element.elements[2].onFail
    },

    createStep(condition, element, onFail) {
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

      const matchElement = condition.elements[2];

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
  .condition-items {
    background-color: #fff;
    border-radius: 0 0 5px 5px;

    .condition-timeout {

    }

    .timeout input{
      font-weight: bold;
    }

    .condition-timeout-title {
      color: #F88859;
      font-size: 10px;
      font-weight: bold;
      padding: 5px;
      border-bottom: 1px solid #D8D8D8;
    }

    .condition-timeout-controls {
      display: flex;
      border-bottom: 1px solid #D8D8D8;
    }

    .condition-timeout-control {
      width: 60%;
      padding: 18px;
      color: #828282;
      flex-shrink: 0;
    }

    .condition-timeout-matches {
      display: flex;
      width: 100%;
      flex-direction: column;
      border-left: 1px dashed #D8D8D8;

      & > div {
        padding: 13px 20px 13px 13px;
        text-align: right;
        position: relative;
      }
    }

    .condition-timeout-match {
      color: #28C3A7;
      border-bottom: 1px dashed #D8D8D8;
    }

    .condition-timeout-fail {
      color: #D31B02
    }

    .add-condition-button {
      padding: 8px;
      text-align: center;
      color: #ccc;
      cursor: pointer;
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