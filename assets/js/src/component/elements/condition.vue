<template>
  <div class="condition-items">
    <template v-for="element in elements">
      <div class='condition-item' :key="element.id">
        <div class="condition-item-title">{{element.displaySettings.type}}</div>
          <div class="condition-item-controls">
            <div class="condition-item-control">
              <template v-if="element.displaySettings.type === 'timeout'">
                IF,<br>
                within: <timeout :element="element"></timeout><br>
                the user:
              </template>
              <template v-else>
                IF,<br>
                followers count<br>
                is <el-select class="hidden-select" v-model="getRule(element).condition.operand" size="mini" popper-class="small-dropdown">
                    <el-option label="Less" value="lt"></el-option>
                    <el-option label="More" value="gt"></el-option>
                  </el-select> than <input-autosize v-model="getRule(element).condition.value" only-numbers></input-autosize>
              </template>
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" :ref="element.id">
                Reply
                <add-step-popup :available-list="availableList" @add-step="createStep(element, $event)" v-if="!hasOnMatch(element)"></add-step-popup>
              </div>
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
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
import elementWarning from '../elementWarning';
import inputAutosize from '../inputAutosize';

export default {
  props: ['elements'],

  components: {
    addConditionPopup,
    elementWarning,
    addStepPopup,
    timeout,
    inputAutosize
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

    getRule(element) {
      return element.elements.find(element => element.type === 'rule')
    },

    hasOnMatch(element) {
      const { getRule } = this;

      return getRule(element).onMatch
    },

    hasOnFail(element) {
      const { getRule } = this;

      return getRule(element).onFail
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

      const matchElement = condition.elements.find(element => element.type === 'rule');

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
    border: 1px solid #D8D8D8;

    .condition-item {

    }

    .hidden-select {
      .el-input__inner {
        width: 30px !important;
      }
    }

    .timeout input{
      font-weight: bold;
    }

    .condition-item-title {
      color: #F88859;
      font-size: 10px;
      font-weight: bold;
      padding: 5px;
      border-bottom: 1px solid #D8D8D8;

      &::first-letter {
        text-transform: uppercase;
      }
    }

    .condition-item-controls {
      display: flex;
      border-bottom: 1px solid #D8D8D8;
    }

    .condition-item-control {
      width: 60%;
      padding: 18px;
      color: #828282;
      flex-shrink: 0;
    }

    .condition-item-matches {
      display: flex;
      width: 100%;
      flex-direction: column;
      border-left: 1px dashed #D8D8D8;

      & > div {
        padding: 13px 20px 13px 13px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: relative;
      }
    }

    .condition-item-match {
      color: #28C3A7;
      border-bottom: 1px dashed #D8D8D8;
    }

    .condition-item-fail {
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