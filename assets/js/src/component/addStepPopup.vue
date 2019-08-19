<template>
  <el-popover popper-class="add-step-popup" placement="right" v-model="isShow" trigger="click">
    <div class="add-step-button" slot="reference">
      <slot></slot>
    </div>
    <div class="types-of-elements">
      <div class="type-of-element">
        <add-message-popup :available-list="availableList" @on-select="selectElement" >
          <span class="message-elements">Messages</span>
        </add-message-popup>
      </div>
      <div class="type-of-element">
        <add-trigger-popup :available-list="availableList" @on-select="selectElement" >
          <span class="trigger-elements">Triggers</span>
        </add-trigger-popup>
      </div>
      <div class="type-of-element">
        <add-action-popup :available-list="availableList" @on-select="selectElement">
          <span class="action-elements">Actions</span>
        </add-action-popup>
      </div>
      <div class="type-of-element">
        <add-condition-popup :available-list="availableList" @on-select="selectElement">
          <span class="condition-elements">Conditions</span>
        </add-condition-popup>
      </div>
    </div>
  </el-popover>
</template>

<script>
import addMessagePopup from './addMessagePopup';
import addTriggerPopup from './addTriggerPopup';
import addActionPopup from './addActionPopup';
import addConditionPopup from './addConditionPopup';

export default {
  data() {
    return {
      isShow: false,
    }
  },

  props:['availableList'],

  components: {
    addTriggerPopup,
    addActionPopup,
    addMessagePopup,
    addConditionPopup
  },

  methods: {
    selectElement(element) {
      this.$emit('add-step', JSON.parse(JSON.stringify(element)));
      this.isShow = false;
    }
  }
}
</script>

<style lang="scss">
  .add-step-popup {
    .types-of-elements {
      .type-of-element {
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #828282;
        cursor: pointer;

        &:not(:last-child) {
          margin-bottom: 4px;
        }

        .trigger-elements:hover {
          border-color: #7EC6C6;
          color: #7EC6C6;
          background-color: #F8F8F8;
        }

        .action-elements:hover {
          border-color: #F4B109;
          color: #F4B109;
          background-color: #F8F8F8;
        }

        .message-elements:hover {
          border-color: #6A12CB;
          color: #6A12CB;
          background-color: #F8F8F8;
        }

        .condition-elements:hover {
          border-color: #FF9B71;
          color: #FF9B71;
          background-color: #F8F8F8;
        }

        .el-popover__reference {
          display: block;
          width: 100%;

          & > span {
            border-radius: 5px;
            display: block;
            padding: 11px;
            border: 1px solid #D8D8D8;
          }
        }
      }
    }
  }
</style>
