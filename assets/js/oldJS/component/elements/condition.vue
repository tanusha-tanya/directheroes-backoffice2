<template>
  <div class="condition-items">
    <template v-for="element in elements">
      <div class='condition-item' :key="element.id">
        <div class="condition-item-title">
          {{conditionTitle[element.displaySettings.type]}}
          <element-warning :element="element"></element-warning>
        </div>
        <template v-if="element.displaySettings.type === 'verified'">
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Is verified?
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" :ref="element.id">
                Yes
                <add-tag-popup
                  :available-list="availableList(element)"
                  @select="createStep(element, $event)"
                  :existing-link="getRule(element).onMatch"
                  :builder="builder"
                  ></add-tag-popup>
               </div>
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                No
                <add-tag-popup
                  :available-list="availableList(element, true)"
                  @select="createStep(element, $event, true)"
                  :existing-link="getRule(element).onFail"
                  :builder="builder"
                  ></add-tag-popup>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="element.displaySettings.type === 'topCategory'">
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Is Majority Member?
              <keywords v-model="element.elements[0].condition.value.constraint" :list="categoriesInBranch"></keywords>
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" :ref="element.id">
                Yes
                <add-tag-popup
                  :available-list="availableList(element)"
                  @select="createStep(element, $event)"
                  :existing-link="getRule(element).onMatch"
                  :builder="builder"
                ></add-tag-popup>
               </div>
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                No
                <add-tag-popup
                  :available-list="availableList(element, true)"
                  @select="createStep(element, $event, true)"
                  :existing-link="getRule(element).onFail"
                  :builder="builder"
                ></add-tag-popup>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="element.displaySettings.type === 'hasTag'">
          <div class="condition-item-controls">
            <div class="condition-item-control">
              <keywords v-model="element.elements[0].condition.value" :list="categories"></keywords>
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" :ref="element.id">
                Yes
                <add-tag-popup
                  :available-list="availableList(element)"
                  @select="createStep(element, $event)"
                  :existing-link="getRule(element).onMatch"
                  :builder="builder"
                ></add-tag-popup>
               </div>
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                No
                <add-tag-popup
                  :available-list="availableList(element, true)"
                  @select="createStep(element, $event, true)"
                  :existing-link="getRule(element).onFail"
                  :builder="builder"
                ></add-tag-popup>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="element.displaySettings.type === 'scarcity'">
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Is among N people
            </div>
            <div class="condition-item-matches">
              <template v-for="(subElement, index) in element.elements">
                <div class="condition-item-match" v-if="subElement.type === 'rule'" :ref="element.id + index" :key="subElement.id" >
                  <input-autosize v-model="subElement.condition.value" only-numbers></input-autosize>
                  <add-tag-popup
                    :available-list="availableList(element)"
                    @select="createStep(element, $event, null, subElement)"
                    :existing-link="subElement.onMatch"
                    :builder="builder"
                  ></add-tag-popup>
                  <div class="delete-condition-value" v-if="element.elements.length > 2" @click="deleteScarcityElement(subElement)">
                    <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.018 10L21 18.554 19.48 20l-8.98-8.554L1.518 20 0 18.554 8.98 10 0 1.446 1.518 0 10.5 8.554 19.48 0 21 1.446z"
                        fill="currentColor"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </template>
              <div class="add-condition-value" @click="addScarcityCondition">
                + Add value
              </div>
            </div>
          </div>
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Among people greater then
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                {{ lastScarcityRule.condition.value }}
                <add-tag-popup
                  :available-list="availableList(element, true)"
                  @select="createStep(element, $event, true, lastScarcityRule)"
                  :existing-link="lastScarcityRule.onFail"
                  :builder="builder"
                ></add-tag-popup>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="element.displaySettings.type === 'waitTillCondition'">
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Wait For <timeout :element="element"></timeout><br>
              Since: <strong>Round start</strong>
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" :ref="element.id+'3'">
                Then
                <add-tag-popup
                  :available-list="availableList(element)"
                  @select="createStep(element, $event)"
                  :existing-link="getWaitTillRule(element, 'time').onMatch"
                  :builder="builder"
                ></add-tag-popup>
               </div>
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                If late
                <add-tag-popup
                  :available-list="availableList(element, true)"
                  @select="createStep(element, $event, true)"
                  :existing-link="getWaitTillRule(element, 'runtime').onFail"
                  :builder="builder"
                ></add-tag-popup>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="element.displaySettings.type === 'subscriberField'">
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Subscriber field <br>
              <el-input
                class="custom-field"
                size="small"
                placeholder="Enter name"
                v-model="subscribersField"
              ></el-input><br>
              is <el-select class="hidden-select" :value="getRule(element).condition.operand" size="mini" popper-class="small-dropdown" @change="setSubscriberFieldRulesOperand">
                  <el-option label="Less" value="lt"></el-option>
                  <el-option label="Greater" value="gt"></el-option>
                </el-select> than

            </div>
            <div class="condition-item-matches">
              <div class="condition-item-match" v-for="(subElement, index) in element.elements" :ref="element.id + index" :key="subElement.id" >
                <input-autosize v-model="subElement.condition.value" only-numbers></input-autosize>
                <add-tag-popup
                  :available-list="availableList(element)"
                  @select="createStep(element, $event, null, subElement)"
                  :existing-link="subElement.onMatch"
                  :builder="builder"
                ></add-tag-popup>
                <div class="delete-condition-value" v-if="element.elements.length > 1 " @click="deleteSubscriberFieldElement(subElement)">
                  <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.018 10L21 18.554 19.48 20l-8.98-8.554L1.518 20 0 18.554 8.98 10 0 1.446 1.518 0 10.5 8.554 19.48 0 21 1.446z"
                      fill="currentColor"
                      fill-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div class="add-condition-value" @click="addSubscriberFieldCondition">
                + Add value
              </div>
            </div>
          </div>
          <div class="condition-item-controls">
            <div class="condition-item-control">
              Subscriber field value is
            </div>
            <div class="condition-item-matches">
              <div class="condition-item-fail" :ref="`${element.id}-fail`">
                {{ elseSubscriberFieldText }}
                <add-tag-popup
                  :available-list="availableList(element, true)"
                  @select="createStep(element, $event, true, lastSubscriberFieldRule)"
                  :existing-link="lastSubscriberFieldRule.onFail"
                  :builder="builder"
                ></add-tag-popup>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="element.displaySettings.type === 'followers'">
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
                <add-tag-popup
                  :available-list="availableList(element)"
                  @select="createStep(element, $event, null, subElement)"
                  :existing-link="subElement.onMatch"
                  :builder="builder"
                ></add-tag-popup>
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
                <add-tag-popup
                  :available-list="availableList(element, true)"
                  @select="createStep(element, $event, true, lastFollowersRule)"
                  :existing-link="lastFollowersRule.onFail"
                  :builder="builder"
                ></add-tag-popup>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue';
import elementsPermissions from '../../elements/permissions'
import addConditionPopup from '../addConditionPopup';
import addTagPopup from '../addTagPopup';
import timeout from '../timeout';
import ObjectId from '../../utils/ObjectId';
import elementWarning from '../elementWarning';
import inputAutosize from '../inputAutosize';
import keywords from '../keywords';

export default {
  data() {
    return {
      conditionTitle: {
        timeout: 'the contact to reply',
        followers: 'Followers',
        verified: 'Is Verified',
        topCategory: 'Is Majority Member',
        scarcity: 'Scarcity',
        hasTag: 'Has Tag',
        waitTillCondition: 'Wait for',
        subscriberField: 'Subscriber Field'
      }
    }
  },

  props: ['elements', 'builder'],

  components: {
    addConditionPopup,
    elementWarning,
    addTagPopup,
    timeout,
    inputAutosize,
    keywords
  },

  computed: {
    elseText() {
      const { lastFollowersRule, followersElement } = this;
      const countMethod = lastFollowersRule.condition.operand === 'gt' ? Math.min : Math.max;
      let countElement = followersElement.elements.reduce((accumulator, element) => countMethod(accumulator, element.condition.value), lastFollowersRule.condition.value) ;

      return `${countElement} or ${ lastFollowersRule.condition.operand === 'gt' ? 'less' : 'greater' }`;
    },

    elseSubscriberFieldText() {
      const { lastSubscriberFieldRule, subscriberFieldElement } = this;
      const countMethod = lastSubscriberFieldRule.condition.operand === 'gt' ? Math.min : Math.max;
      let countElement = subscriberFieldElement.elements.reduce((accumulator, element) => countMethod(accumulator, element.condition.value), lastSubscriberFieldRule.condition.value) ;

      return `${countElement} or ${ lastSubscriberFieldRule.condition.operand === 'gt' ? 'less' : 'greater' }`;
    },

    lastFollowersRule() {
      const { followersElement } = this;

      return followersElement.elements[followersElement.elements.length - 1]
    },

    followersElement() {
      return this.elements.find(element => element.displaySettings.type === 'followers');
    },

    lastSubscriberFieldRule() {
      const { subscriberFieldElement } = this;

      return subscriberFieldElement.elements[subscriberFieldElement.elements.length - 1]
    },

    subscriberFieldElement() {
      return this.elements.find(element => element.displaySettings.type === 'subscriberField');
    },

    scarcityElement() {
      return this.elements.find(element => element.displaySettings.type === 'scarcity');
    },

    lastScarcityRule() {
      const { scarcityElement } = this;

      return scarcityElement.elements[scarcityElement.elements.length - 1]
    },

    categories() {
      const { allCategories } = this.builder;

      return allCategories;
    },

    categoriesInBranch() {
      const { getParentSteps } = this.builder;
      const categories = [];
      const getTagsFromStep = (stepId) => {
        const parents = getParentSteps(stepId);

        parents.forEach(parent => {
          parent.elements.some(element => {
            if (!element.displaySettings || !['action', 'sub-input'].includes(element.displaySettings.subType)) return true;

            if (!element.body || element.body.action !== 'addCategory') return;

            if (!element.body.name) return;

            element.body.name.forEach(nameItem => {
              if (categories.includes(nameItem)) return;

              categories.push(nameItem);
            });
          })

          getTagsFromStep(parent.id);
        })
      }

      getTagsFromStep(this.$parent.step.id);

      return categories
    },

    subscribersField: {
      get() {
        const { lastSubscriberFieldRule } = this;

        return lastSubscriberFieldRule.condition.field;
      },
      set(value) {
        const { subscriberFieldElement } = this;

        subscriberFieldElement.elements.forEach(element => element.condition.field = value)
      }
    }
  },

  methods: {
    availableList(element, isFail) {
      const { builder } = this;

      return builder.availableListByElement(element, isFail)
    },

    addScarcityCondition() {
      const { lastScarcityRule, scarcityElement } = this;
      const newScarcityElement = JSON.parse(JSON.stringify(lastScarcityRule));

      lastScarcityRule.onFail = { action: 'fallthrough' };

      newScarcityElement.id = (new ObjectId).toString();
      delete newScarcityElement.onMatch;

      scarcityElement.elements.push(newScarcityElement);
    },

    addFollowerCondition() {
      const { lastFollowersRule, followersElement } = this;
      const newFollowerElement = JSON.parse(JSON.stringify(lastFollowersRule));

      lastFollowersRule.onFail = { action: 'fallthrough' };

      newFollowerElement.id = (new ObjectId).toString();
      delete newFollowerElement.onMatch;

      followersElement.elements.push(newFollowerElement);
    },

    addSubscriberFieldCondition() {
      const { lastSubscriberFieldRule, subscriberFieldElement } = this;
      const newSubscriberFieldElement = JSON.parse(JSON.stringify(lastSubscriberFieldRule));

      lastSubscriberFieldRule.onFail = { action: 'fallthrough' };

      newSubscriberFieldElement.id = (new ObjectId).toString();
      delete newSubscriberFieldElement.onMatch;

      subscriberFieldElement.elements.push(newSubscriberFieldElement);
    },

    getRule(element) {
      return element.elements.find(element => element.type === 'rule')
    },

    createStep(condition, element, onFail, currentRule) {
      const { getWaitTillRule, builder } = this;
      const { displaySettings, id } = condition;
      const isExistingStep = element.type === 'existingStep';
      let conditionElement = condition;

      if (displaySettings.type === 'waitTillCondition') {
        const waitTillRule = getWaitTillRule(condition, onFail ? 'runtime' : 'time')

        conditionElement = {
          id,
          displaySettings,
          elements:[waitTillRule]
        }
      } else if (['followers', 'scarcity', 'subscriberField'].includes(displaySettings.type)) {
        conditionElement = {
          id,
          displaySettings,
          elements:[currentRule]
        }
      }

      builder.addStep(conditionElement, element, onFail)
    },

    setSubscriberFieldRulesOperand(value) {
      const { subscriberFieldElement } = this;

      if (!subscriberFieldElement) return;

      subscriberFieldElement.elements.forEach(element => element.condition.operand = value);
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

    deleteSubscriberFieldElement(element) {
      const { lastSubscriberFieldRule, subscriberFieldElement } = this;

      if (lastSubscriberFieldRule === element) {
        const newLastElement = subscriberFieldElement.elements[subscriberFieldElement.elements.length - 2];

        newLastElement.onFail = lastSubscriberFieldRule.onFail;
      }

      subscriberFieldElement.elements.splice(subscriberFieldElement.elements.indexOf(element), 1);
    },

    deleteScarcityElement(element) {
      const { lastScarcityRule, scarcityElement } = this;

      if (lastScarcityRule === element) {
        const newLastElement = scarcityElement.elements[scarcityElement.elements.length - 2];

        newLastElement.onFail = lastScarcityRule.onFail;
      }

      scarcityElement.elements.splice(scarcityElement.elements.indexOf(element), 1);
    },

    getWaitTillRule(element, entityType) {
      return element.elements.find(element => element.type === 'rule' && element.condition.entity === entityType);
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

    .timeout input{
      font-weight: bold;
    }

    .condition-item-title {
      color: #F88859;
      font-size: 10px;
      font-weight: bold;
      padding: 5px;
      border-bottom: 1px solid #D8D8D8;
      position: relative;

      .element-warning {
        top:5px;
        right: 10px;
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

      &.timeout-item {
        .condition-item-control {
          width: 50%;
        }
      }
    }

    .condition-item-control {
      width: 60%;
      padding: 18px;
      color: #828282;
      flex-shrink: 0;

      strong {
        font-weight: bold;
        color: #2c3e50;
        font-size: 12px;
      }
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