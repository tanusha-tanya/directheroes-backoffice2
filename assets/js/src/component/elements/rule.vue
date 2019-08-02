<template>
  <div class="rule-items">
    <template v-for="element in elements">
      <div class="rule-item" v-if="ruleType(element) == 'list'" :key="element.id">
        <div class="rule-item-title">{{ ruleTitles['list'] }}</div>
        <keywords v-model="element.condition.value"></keywords>
        <add-step-popup @add-step="createStep(element, $event)" v-if="!element.onMatch"></add-step-popup>
      </div>
    </template>
    <div class="add-rule-button">
      <add-trigger-popup @on-select="addTrigger">
        <span>+ Add rule item</span>
      </add-trigger-popup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import keywords from '../keywords';
import ObjectId from '../../utils/ObjectId';
import addTriggerPopup from '../addTriggerPopup';
import addStepPopup from '../addStepPopup';

export default {

  props: ['elements'],

  components: {
    keywords,
    addTriggerPopup,
    addStepPopup
  },

  computed: {
    ruleTitles() {
      return {
        list: 'Keywords',
        postReply: 'Post Reply',
        adReply: 'Ad Reply',
        storyReply: 'Story Reply',
      }
    },
  },

  methods: {
    ruleType(element) {
      const { value, entity, operand } = element.condition;

      if (['postReply', 'adReply', 'storyReply'].includes(value)) {
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

      Vue.set(rule, 'onMatch', {
        action: 'goto',
        target: step.id
      });

      this.$emit('add-step', step);
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
  }

  .add-rule-button {
    padding: 8px;
    text-align: center;
    color: #ccc;
  }
}
</style>
