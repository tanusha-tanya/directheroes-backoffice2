<template>
  <el-popover popper-class="add-step-popup" placement="right" v-model="isShow">
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
      <div class="type-of-element">
        <span class="exist-step-connection" v-if="(availableList || []).includes('existingStep')" @click="addExistStepConnection">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 116.936 116.936" style="enable-background:new 0 0 116.936 116.936;"
            xml:space="preserve">
              <path d="M23.144,102.317c-4.037,0-7.308,3.271-7.308,7.31c0,4.037,3.271,7.309,7.308,7.309h70.647
                c4.037,0,7.309-3.271,7.309-7.309V60.903V7.309C101.1,3.272,97.829,0,93.791,0H23.144c-4.037,0-7.308,3.271-7.308,7.309
                c0,4.036,3.271,7.309,7.308,7.309h63.338v38.978h-56.03c-4.036,0-7.308,3.271-7.308,7.308s3.272,7.309,7.308,7.309h56.03v34.105
                L23.144,102.317L23.144,102.317z" fill="currentColor"/>
          </svg>
          Existing step
        </span>
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

  props:['availableList', 'builder', 'linkElement'],

  components: {
    addTriggerPopup,
    addActionPopup,
    addMessagePopup,
    addConditionPopup
  },

  methods: {
    selectElement(element) {
      const { builder, linkElement } = this;

      this.$emit('select', element);
      this.isShow = false;

      if (!linkElement) return;

      builder.addStep(linkElement,  JSON.parse(JSON.stringify(element)));
    },

    addExistStepConnection() {
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
