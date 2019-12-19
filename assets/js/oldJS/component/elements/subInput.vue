<template>
  <div class="user-sub-input">
    <div class="user-sub-input-select" :ref="linker && linker.id">
      <el-select :value="element.displaySettings.type" @change="changeAction" size="small" popper-class="user-sub-input-dropdown">
        <el-option value="subscriber" :label="`Store e-mail`"></el-option>
        <el-option value="zapier" label="Connect to Zapier"></el-option>
      </el-select>
      <add-tag-popup
        :available-list="availableList"
        @add-step="createStep"
        v-if="!linker"
      ></add-tag-popup>
    </div>
    <zapier :element="element" v-if="element.displaySettings.type === 'zapier'"></zapier>
  </div>
</template>

<script>
import ObjectId from '../../utils/ObjectId';
import Vue from 'vue'
import axios from 'axios'
import addTagPopup from '../addTagPopup';
import zapier from '../zapier';
import elementsPermissions from '../../elements/permissions'
import { userInputSubscriber, userInputZapier } from '../../elements/userInput';

export default {
  components: {
    addTagPopup,
    zapier
  },

  props: ['elements'],

  computed: {
    element() {
      const { elements } = this;

      return elements[0];
    },

    elementField() {
      const { element } = this;

      return (element.body.data || element.body.destination).field
    },

    linker() {
      const { elements } = this;

      return elements.find(element => element.type === 'linker');
    },

    availableList() {
      const { triggers, supercross } = this.dhAccount.flowBuilderSettings.triggers;

      return elementsPermissions.fromUserInput.concat(triggers.messageTypes, supercross);
    },
    selectedValue() {

    }
  },

  methods: {
    changeAction(value) {
      const { element, elements } = this;
      let newElement = JSON.parse(JSON.stringify(userInputSubscriber));

      if (value === 'zapier') {
        const storeAction = newElement;
        newElement = JSON.parse(JSON.stringify(userInputZapier));

        delete storeAction.displaySettings;

        newElement.elements.push(storeAction);

        newElement.elements.forEach(element => element.id = (new ObjectId).toString())
      }

      newElement.id = (new ObjectId).toString();

      elements.splice(elements.indexOf(element), 1, newElement)
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