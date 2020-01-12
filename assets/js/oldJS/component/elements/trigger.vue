<template>
  <div class="rule-items">
    <template v-for="element in elements">
      <rule-item
        :element="element"
        :is-entry="isEntry"
        :key="element.id"
        @delete-trigger="deleteRule"
        :builder="builder"
        @add-step="$emit('add-step', $event)"
        :elements="elements"
        v-if="element.type !== 'checkpoint' && (element.displaySettings && element.displaySettings.subType !== 'settings')"
        ></rule-item>
    </template>
    <div class="add-rule-button">
      <add-trigger-popup @on-select="addTrigger" :available-list="builder.availableListByElement(undefined, false, isEntry)">
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

export default {
  props: ['elements', 'isEntry', 'builder'],

  components: {
    ruleItem,
    addTriggerPopup,
  },

  methods: {
    addTrigger(element) {
      const { elements } = this;

      element.elements.forEach(element => element.id = (new ObjectId).toString())

      elements.push({
        id: (new ObjectId).toString(),
        ...element
      })
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
  border: 1px solid #D8D8D8;
  border-radius: 0 0 5px 5px;

  .rule-item {
    position: relative;
    padding: 18px;
    border-bottom: 1px solid #D8D8D8;
    color: #828282;

    .add-step-button,  {
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

    .el-input {
      margin-top: 5px;
      .el-input__inner {
        height: 27px;
        font: 11px/27px 'Lato';
        padding: 0 10px;
      }
    }

    &:hover {
      background-color: rgba(#5CA6A6, .25);

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
    background-color: #F8F8F8;
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
