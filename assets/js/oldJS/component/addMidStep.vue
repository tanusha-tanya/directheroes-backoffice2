<template>
  <el-popover popper-class="add-mid-step-popup" placement="right" v-model="isShow" trigger="click">
    <div class="add-step-button" slot="reference">
      <slot></slot>
    </div>
    <div
      class="action-item"
      @click="selectElement(action)" v-if="availableList && availableList.includes('addCategory')">
      Add tag
    </div>
    <div
      class="action-item"
      @click="selectElement(sendText)" v-if="availableList && availableList.includes('sendText')">
      Text
    </div>
    <div
      class="action-item"
      @click="selectElement(sendMedia)" v-if="availableList && availableList.includes('sendMedia')">
      Image
    </div>
    <div
      class="action-item"
      @click="selectElement(delay)" v-if="availableList && availableList.includes('delay')">
      Delay
    </div>
  </el-popover>
</template>

<script>
import addMessagePopup from './addMessagePopup';
import addTriggerPopup from './addTriggerPopup';
import addActionPopup from './addActionPopup';

export default {
  data() {
    return {
      isShow: false,
    }
  },

  props:['availableList'],

  components: {
    addMessagePopup,
    addTriggerPopup,
    addActionPopup,
  },

  computed: {
    delay() {
      const sendDelayAction = messages.find(action => action.template.displaySettings.type == 'delay');

      return sendDelayAction.template
    }
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
.add-mid-step-popup {
  .types-of-elements {
    .type-of-element {
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #828282;
      cursor: pointer;

      .el-popover__reference span:before {
        content: '';
        display: inline-block;
        width: 25px;
        height: 25px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin-right: 9px;
      }

      &:not(:last-child) {
        margin-bottom: 4px;
      }

      .trigger-elements {
        &:before {
          background-image: url(../assets/v5/triggers.png);
          background-size: 80% auto !important;
        }

        &:hover {
          border-color: #7EC6C6;
          color: #7EC6C6;
          background-color: #F8F8F8;
        }
      }

      .action-elements {
        &:before {
          background-image: url(../assets/v5/actions.png);
        }

        &:hover {
          border-color: #F4B109;
          color: #F4B109;
          background-color: #F8F8F8;
        }
      }

      .message-elements {
        &:before {
          background-image: url(../assets/v5/messages.png);
        }

        &:hover {
          border-color: #6A12CB;
          color: #6A12CB;
          background-color: #F8F8F8;
        }
      }

      .condition-elements{
        &:before {
          background-image: url(../assets/v5/conditions.png);
        }

        &:hover {
          border-color: #FF9B71;
          color: #FF9B71;
          background-color: #F8F8F8;
        }
      }

      .exist-step-connection {
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid #D8D8D8;

        svg {
          color: #6A12CB;
          width: 20px;
          margin-right: 9px;
        }

        &:hover {
          border-color: #6A12CB;
          color: #6A12CB;
          background-color: #F8F8F8;
        }
      }

      .el-popover__reference {
        display: block;
        width: 100%;

        & > span {
          border-radius: 5px;
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid #D8D8D8;
        }
      }
    }
  }
}
</style>