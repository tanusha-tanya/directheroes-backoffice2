<template>
  <div class="rule-items">
    <template v-for="element in elements">
      <rule-item
        :element="element"
        is-entry="isEntry"
        :key="element.id"
        @delete-trigger="deleteRule"
        @create-step="createStep(element, $event)"
        :elements="elements"
        ></rule-item>
    </template>
    <div class="add-rule-button">
      <add-trigger-popup @on-select="addTrigger" :available-list="availableTriggerList">
        <span>+ Add rule item</span>
      </add-trigger-popup>
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import utils from '../../utils'
import ruleItem from './ruleItem';
import ObjectId from '../../utils/ObjectId';
import addTriggerPopup from '../addTriggerPopup';
import elementsPermissions from '../../elements/permissions'

export default {
  props: ['elements', 'isEntry'],

  components: {
    ruleItem,
    addTriggerPopup,
  },

  computed: {
    availableTriggerList() {
      const { isEntry } = this;
      const { messageTypes } = this.dhAccount.flowBuilderSettings[isEntry ? 'growthTools': 'triggers'];

      return elementsPermissions.fromTriggerStep.concat(messageTypes);
    },
  },

  methods: {

    addTrigger(element) {
      const { elements, isEntry } = this;

      if (element.type === 'group' && element.displaySettings.type === 'trigger') {
        if (isEntry) {
          element = element.elements.find(element => element.type === 'rule');
        } else {
          element.elements.forEach(element => element.id = (new ObjectId).toString())
        }
      }

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

        console.log(rule, element);

        if (element.displaySettings.type == 'timeout' && rule.type === 'group') {
          const checkpoint = rule.elements.find(element => element.type === 'checkpoint')
          const elementRule = element.elements.find(element => element.type === 'rule')

          elementRule.checkpointId = checkpoint.id
        }
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
