<template>
  <div class="rule-items">
    <template v-for="element in elements">
      <div class="rule-item" :key="element.id" :ref="element.id">
        <element-warning :element="element"></element-warning>
        <div class="rule-item-title">{{ ruleTitles[ruleType(element)] }}</div>
        <template v-if="ruleType(element) == 'list'">
          <keywords v-model="element.condition.value"></keywords>
        </template>
        <template v-else-if="ruleType(element) == 'postReply'">
          <el-input
            size="small"
            placeholder="Please enter post URL"
            v-model="element.onMatch.elements[0].condition.value"
          >
          </el-input>
        </template>
        <add-step-popup :available-list="availableList" @add-step="createStep(element, $event)" v-if="!hasOnMatch(element)"></add-step-popup>
        <div class="rule-delete-button" @click="deleteRule(element)" v-if="elements.length > 1 && !hasOnMatch(element)">
          <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.018 10L21 18.554 19.48 20l-8.98-8.554L1.518 20 0 18.554 8.98 10 0 1.446 1.518 0 10.5 8.554 19.48 0 21 1.446z" fill="currentColor" fill-rule="evenodd"/></svg>
        </div>
      </div>
    </template>
    <div class="add-rule-button">
      <add-trigger-popup @on-select="addTrigger" :available-list="availableTriggerList">
        <span>+ Add rule item</span>
      </add-trigger-popup>
    </div>
  </div>
</template>

<script>
import elementsPermissions from '../../elements/permissions'
import Vue from 'vue';
import utils from '../../utils'
import keywords from '../keywords';
import ObjectId from '../../utils/ObjectId';
import addTriggerPopup from '../addTriggerPopup';
import addStepPopup from '../addStepPopup';
import elementWarning from '../elementWarning'

export default {
  data() {
    return {
      availableList: elementsPermissions.fromTrigger
    }
  },

  props: ['elements', 'isEntry'],

  components: {
    keywords,
    addTriggerPopup,
    addStepPopup,
    elementWarning
  },

  computed: {
    ruleTitles() {
      return {
        list: 'Keywords',
        postReply: 'Post Reply',
        adReply: 'Ad Reply',
        storyReply: 'Story Reply',
        storyMention: 'Story Mention',
        mediaShare: 'Media Share'
      }
    },

    availableTriggerList() {
      const { isEntry } = this;
      const { messageTypes } = this.dhAccount.flowBuilderSettings[isEntry ? 'growthTools': 'triggers'];

      return elementsPermissions.fromTriggerStep.concat(messageTypes);
    },
  },

  methods: {
    hasOnMatch(element) {
      const matchElement = utils.getOnMatchElement(element);

      return matchElement && matchElement.onMatch;
    },

    ruleType(element) {
      const { value, entity, operand } = element.condition;

      if (['postReply', 'adReply', 'storyReply', 'storyMention', 'mediaShare'].includes(value)) {
        return value;
      } else if (entity === 'message' && operand === 'contains') {
        return 'list'
      }
    },

    addTrigger(element) {
      const { elements } = this;

      elements.push({
        id: (new ObjectId).toString(),
        ...element
      })
    },

    createStep(rule, element) {
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

      const matchElement = utils.getOnMatchElement(rule);

      Vue.set(matchElement, 'onMatch', {
        action: 'goto',
        target: step.id
      });

      this.$emit('add-step', step);
    },

    deleteRule(element) {
      const { elements } = this;

      elements.splice(elements.indexOf(element), 1);
    }
  }
}
</script>

<style lang="scss">
.rule-items {
  background-color: #fff;
  border-radius: 0 0 5px 5px;

  .rule-item {
    position: relative;
    padding: 18px;
    border-bottom: 1px solid #D8D8D8;
    color: #828282;

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

    &:hover {
      .rule-delete-button {
        opacity: 1;
      }
    }
  }

  .add-rule-button {
    padding: 8px;
    text-align: center;
    color: #ccc;
    cursor: pointer;
  }

  .rule-delete-button {
    width: 10px;
    height: 10px;
    color: #b4b4b4;
    position: absolute;
    right: 7px;
    top: 2px;
    opacity: 0;
    cursor: pointer;

    &:hover {
      color: #e74c49;
    }
  }
}
</style>
