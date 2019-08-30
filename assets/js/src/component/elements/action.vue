<template>
  <div class="action-items">
    <template v-for="action in elements">
      <div :class="[{'action-item': true}, elementClass(action.body.action)]" v-if="action.type !== 'linker'" :key="action.id">
        <div class="action-item-title">{{ actionTitles[action.body.action] }}</div>
        <element-warning :element="action"></element-warning>
        <template v-if="['addCategory', 'removeCategory'].includes(action.body.action)">
          <keywords v-model="action.body.name"></keywords>
        </template>
        <template v-else-if="action.body.action === 'webhook'">
          <zapier :element="action"></zapier>
        </template>
        <template v-else>
          <div class="unknown-action-wrapper">
            Unknown element
          </div>
        </template>
        <div class="action-delete-button" @click="deleteAction(action)" v-if="elements.length > (linker ? 2 : 1)">
          <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.018 10L21 18.554 19.48 20l-8.98-8.554L1.518 20 0 18.554 8.98 10 0 1.446 1.518 0 10.5 8.554 19.48 0 21 1.446z" fill="currentColor" fill-rule="evenodd"/></svg>
        </div>
      </div>
    </template>
    <div class="action-add-button">
      <add-action-popup @on-select="addElement">
        <span>+ Add action item</span>
      </add-action-popup>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import keywords from '../keywords';
import zapier from '../zapier';
import addActionPopup from '../addActionPopup';
import ObjectId from '../../utils/ObjectId';
import elementWarning from '../elementWarning'

export default {
  props: ['elements'],

  data() {
    return {
      actionTitles:{
        addCategory: 'Add tag',
        removeCategory: 'Remove tag',
        webhook: 'Zapier',
      }
    }
  },

  components: {
    addActionPopup,
    elementWarning,
    keywords,
    zapier,
  },

  computed: {
    dh() {
      return dh
    },

    linker() {
      const { elements } = this;

      return elements.find(element => element.type === 'linker');
    }
  },

  methods: {
    addElement(element) {
      const { elements } = this;

      elements.push({
        id: (new ObjectId).toString(),
        ...element
      });
    },

    elementClass(classType) {
      const classTypes = {
        addCategory: 'send-add-category-action',
        removeCategory: 'send-remove-category-action',
      }

      return classTypes[classType] || 'unknown-action'
    },

    deleteAction(element) {
      const { elements } = this;

      elements.splice(elements.indexOf(element), 1);
    }
  }
}
</script>

<style lang="scss">
.action-items {
  background-color: #fff;
  border: 1px solid #D8D8D8;
  border-top: 0;
  border-radius: 0 0 5px 5px;

  .action-item {
    padding: 18px;
    border-bottom: 1px solid #D8D8D8;
    position: relative;
    color: #828282;

    &:hover {
      .action-delete-button {
        opacity: 1;
      }
    }
  }

  .user-webhook-action {
    padding: 0;
  }

  .keywords {
    .el-tag {
      border-color: #D8D8D8;
      background-color: #fff;
      color: #2D2D2D;
    }
    .el-select .el-tag__close.el-icon-close {
      color: #2D2D2D
    }
  }

  .unknown-action-wrapper {
    padding: 10px 20px;
    border: 1px dashed #D8D8D8;
    font-size: 16px;
    color: #606266;
    border-radius: 7px;
    background-color: rgba(255, 103, 103, 0.68);
  }

  .action-add-button {
    padding: 8px;
    text-align: center;
    color: #ccc;
    cursor: pointer;
  }

  .action-delete-button {
    width: 10px;
    height: 10px;
    color: #b4b4b4;
    position: absolute;
    right: 5px;
    top: 19px;
    opacity: 0;
    cursor: pointer;

    &:hover {
      color: #e74c49;
    }
  }
}
</style>
