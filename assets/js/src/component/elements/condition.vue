<template>
  <div class="condition-items">
    <template v-for="element in elements">
      <div class='condition-item' :key="element.id">
        <div class="condition-item-title">{{conditionTitle[element.displaySettings.type]}}</div>
        <template v-if="element.displaySettings.type === 'timeout'">
          <div class="condition-item-controls">
            <div class="condition-item-control">
              IF,<br>
              within: <timeout :element="element"></timeout><br>
              the user:
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" :ref="element.id">
                Reply
                <add-trigger-popup :available-list="availableList" @on-select="createStep(element, $event)" v-if="!getRule(element).onMatch">
                  <div class="add-step-button"></div>
                </add-trigger-popup>
               </div>
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                NO Reply
                <add-tag-popup :available-list="availableList" @add-step="createStep(element, $event, true)" v-if="!getRule(element).onFail"></add-tag-popup>
                <add-mid-step-popup
                  :available-list="availableList"
                  @add-step="addMidStep($event, element, true)"
                  v-else
                ></add-mid-step-popup>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="element.displaySettings.type === 'verified'">
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Is verified?
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" :ref="element.id">
                Yes
                <add-tag-popup :available-list="availableList" @add-step="createStep(element, $event)" v-if="!element.onMatch"></add-tag-popup>
                <add-mid-step-popup
                  :available-list="availableList"
                  @add-step="addMidStep($event, element)"
                  v-else
                ></add-mid-step-popup>
               </div>
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                No
                <add-tag-popup :available-list="availableList" @add-step="createStep(element, $event, true)" v-if="!element.onFail"></add-tag-popup>
                <add-mid-step-popup
                  :available-list="availableList"
                  @add-step="addMidStep($event, element, true)"
                  v-else
                ></add-mid-step-popup>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Followers count<br>
              is <el-select class="hidden-select" :value="getRule(element).condition.operand" size="mini" popper-class="small-dropdown" @change="setRulesOperand">
                  <el-option label="Less" value="lt"></el-option>
                  <el-option label="Greater" value="gt"></el-option>
                </el-select> than
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" v-for="(subElement, index) in element.elements" :ref="element.id + index" :key="subElement.id" >
                <input-autosize v-model="subElement.condition.value" only-numbers></input-autosize>
                <add-tag-popup :available-list="availableList" @add-step="createStep(subElement, $event)" v-if="!subElement.onMatch"></add-tag-popup>
                <add-mid-step-popup
                  :available-list="availableList"
                  @add-step="addMidStep($event, subElement)"
                  v-else
                ></add-mid-step-popup>
                <div class="delete-condition-value" v-if="element.elements.length > 1 " @click="deleteFollowersElement(subElement)">
                  <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.018 10L21 18.554 19.48 20l-8.98-8.554L1.518 20 0 18.554 8.98 10 0 1.446 1.518 0 10.5 8.554 19.48 0 21 1.446z"
                      fill="currentColor"
                      fill-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div class="add-condition-value" @click="addFollowerCondition">
                + Add value
              </div>
            </div>
          </div>
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Followers count is
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                {{ elseText }}
                <add-tag-popup :available-list="availableList" @add-step="createStep(lastFollowersRule, $event, true)" v-if="!lastFollowersRule.onFail"></add-tag-popup>
                <add-mid-step-popup
                  :available-list="availableList"
                  @add-step="addMidStep($event, lastFollowersRule, true)"
                  v-else
                ></add-mid-step-popup>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <div class="add-condition-button" v-if="false">
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
import addTriggerPopup from '../addTriggerPopup';
import addTagPopup from '../addTagPopup';
import addMidStepPopup from '../addMidStep';
import timeout from '../timeout';
import ObjectId from '../../utils/ObjectId';
import elementWarning from '../elementWarning';
import inputAutosize from '../inputAutosize';

export default {
  data() {
    return {
      conditionTitle: {
        timeout: 'Timeout',
        folowwers: 'Followers',
        verified: 'Is Verified'
      }
    }
  },

  props: ['elements'],

  components: {
    addConditionPopup,
    elementWarning,
    addTagPopup,
    timeout,
    inputAutosize,
    addMidStepPopup,
    addTriggerPopup
  },

  computed: {
    availableConditionList() {
      return []
    },

    elseText() {
      const { lastFollowersRule, followersElement } = this;
      const countMethod = lastFollowersRule.condition.operand === 'gt' ? Math.min : Math.max;
      let countElement = followersElement.elements.reduce((accumulator, element) => countMethod(accumulator, element.condition.value), lastFollowersRule.condition.value) ;

      return `${countElement} or ${ lastFollowersRule.condition.operand === 'gt' ? 'less' : 'greater' }`;
    },

    availableList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.triggers;

      return elementsPermissions.fromCondition.concat(messageTypes)
    },

    lastFollowersRule() {
      const { followersElement } = this;

      return followersElement.elements[followersElement.elements.length - 1]
    },

    followersElement() {
      return this.elements.find(element => element.displaySettings.type === 'followers');
    }
  },

  methods: {
    addCondition() {

    },

    addFollowerCondition() {
      const { lastFollowersRule, followersElement } = this;
      const newFollowerElement = JSON.parse(JSON.stringify(lastFollowersRule));

      lastFollowersRule.onFail = { action: 'fallthrough' };

      newFollowerElement.id = (new ObjectId).toString();
      delete newFollowerElement.onMatch;

      followersElement.elements.push(newFollowerElement);
    },

    getRule(element) {
      return element.elements.find(element => element.type === 'rule')
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
      let matchElement;

      if (element.type === 'group') {
        element.elements.forEach(element => {
          element.id = (new ObjectId).toString()
        })
      }

      if (condition.type === 'rule') {
        matchElement = condition;
      } else {
        matchElement = condition.elements.find(element => element.type === 'rule');
      }

      Vue.set(matchElement, onFail ? 'onFail' : 'onMatch', {
        action: 'goto',
        target: step.id
      });

      this.$emit('add-step', step, condition );
    },

    setRulesOperand(value) {
      const { followersElement } = this;

      if (!followersElement) return;

      followersElement.elements.forEach(element => element.condition.operand = value);
    },

    deleteFollowersElement(element) {
      const { lastFollowersRule, followersElement } = this;

      if (lastFollowersRule === element) {
        const newLastElement = followersElement.elements[followersElement.elements.length - 2];

        newLastElement.onFail = lastFollowersRule.onFail;
      }

      followersElement.elements.splice(followersElement.elements.indexOf(element), 1);
    },

    addMidStep(element, condition, onFail) {
      const step = {
        id: (new ObjectId).toString(),
        elements: [
          {
            id: (new ObjectId).toString(),
            ...element
          }
        ]
      }
      let rule = condition;
      let link;

      if (condition.type !== 'rule') {
        rule = this.getRule(condition);
      }

      if (onFail) {
        link = rule.onFail;
      } else {
        link = rule.onMatch;
      }

      step.elements.push({
        id: (new ObjectId).toString(),
        type: 'linker',
        target: link.target
      })

      link.target = step.id;

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
        width: 42px !important;
        text-align: center;
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
      border-bottom: 1px dashed #D8D8D8;

      &:last-child {
        border-bottom-style: solid;

        .condition-item-control {
          padding: 13px;
        }
      }
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
      border-bottom: 1px dashed #D8D8D8;

      .el-popover__reference {
        position: absolute;
        display: block;
        right: -14px;
        top: calc(50% - 14px);

        .add-step-button {
          position: static;
        }
      }

      input {
        color: #28C3A7;
      }

      &:hover {
        .delete-condition-value {
          opacity: 1;
        }
      }
    }

    .add-condition-value {
      cursor: pointer;
    }

    .delete-condition-value {
      position: absolute;
      top: calc(50% - 6px);
      left: 10px;
      opacity: 0;

      svg {
        width: 10px;
        height: 10px;
      }
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