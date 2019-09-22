<template>
  <el-popover popper-class="add-element-popup" placement="right" trigger="click" v-model="isShow">
    <template slot="reference">
      <slot></slot>
    </template>
    <div class="favorite-elements">
      <div :class="[{'element-item': true, 'element-disabled': !availableList.includes(getElementType(element))}, `element-${getElementType(element)}-type`]" v-for="element in elements" :key="element.title" @click="selectElement(element.template)">
        +{{element.title}}
      </div>
    </div>
    <div class="types-of-elements">
      <div class="type-of-element">
        <add-trigger-popup :available-list="availableList" @on-select="selectElement" >
          <span class="trigger-elements">+Triggers</span>
        </add-trigger-popup>
      </div>
      <div class="type-of-element">
        <add-action-popup :available-list="availableList" @on-select="selectElement">
          <span class="action-elements">+Actions</span>
        </add-action-popup>
      </div>
      <div class="type-of-element">
        <add-condition-popup :available-list="availableList" @on-select="selectElement">
          <span class="condition-elements">+Conditions</span>
        </add-condition-popup>
      </div>
    </div>
  </el-popover>
</template>

<script>
import elementsPermissions from '../elements/permissions'
import messages from '../elements/messages';
import { userInput } from '../elements/userInput';
import addTriggerPopup from './addTriggerPopup'
import addActionPopup from './addActionPopup'
import addConditionPopup from './addConditionPopup'

export default {
  data() {
    const elements = messages.concat([userInput]);

    return {
      isShow: false,
      elements
    }
  },

  components: {
    addTriggerPopup,
    addActionPopup,
    addConditionPopup
  },

  computed: {
    availableList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.triggers;

      return elementsPermissions.fromMessageStep.concat(messageTypes)
    }
  },

  methods: {
    selectElement(element) {
      this.$emit('add-element', JSON.parse(JSON.stringify(element)));
      this.isShow = false;
    },

    getElementType(element) {
      const { template } = element;

      if (template.type === 'group') {
        return template.displaySettings.type || template.displaySettings.subType
      } else {
        return template.body.action
      }
    }
  }
}
</script>

<style lang="scss">
.add-element-popup {
  padding: 0;
  border: 1px solid #CFCFCF;
  min-width: 255px;

  .favorite-elements {
    display: flex;
    flex-wrap: wrap;
    padding: 9px;
    margin: -3px;

    .element-item {
      width: 54px;
      height: 54px;
      border: 1px solid #D8D8D8;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 9px;
      color: #828282;
      margin: 3px;
      cursor: pointer;

      &:hover {
        color: #6A12CB;
        border-color: #6A12CB;

        &:before {
          filter: grayscale(0);
          opacity: 1;
        }
      }

      &:before {
        content: '';
        filter: grayscale(100%);
        display: inline-block;
        width: 21px;
        height: 21px;
        margin-bottom: 5px;
        opacity: .3;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        // margin-right: 9px;
      }

      &.element-sendText-type {
        &:before {
          background-image: url(../assets/svgV5/text.png);
        }
      }

      &.element-sendMedia-type {
        &:before {
          background-image: url(../assets/svgV5/image.png);
        }
      }

      &.element-delay-type {
        &:before {
          background-image: url(../assets/svgV5/delayBtn.png);
        }
      }

      &.element-user-input-type {
        &:before {
          background-image: url(../assets/svgV5/userInputBtn.png);
        }
      }
    }
  }

  .types-of-elements {
    padding: 9px;
    border-top: 1px solid #D5D5D5;
    display: flex;

    .type-of-element {
      flex-grow: 1;
      width: 30%;
      text-align: center;
      font-size: 9px;
      color: #828282;
      cursor: pointer;

      .el-popover__reference span:before {
        content: '';
        filter: grayscale(100%);
        display: inline-block;
        width: 23px;
        height: 23px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        // margin-right: 9px;
      }

      &:not(last-child) {
        margin-right: 4px;
      }

     .trigger-elements{
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
      .action-elements{
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

      .el-popover__reference {
        width: 100%;


        span {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid #D8D8D8;
          border-radius: 5px;
          padding: 6px;

          &:hover:before {
            filter: grayscale(0);
          }
        }
      }
    }
  }
}
</style>
