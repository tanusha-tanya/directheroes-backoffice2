<template>
  <div class="campaign-builder" v-if="currentCampaign">
    <!-- <div class="campaign-builder-controls">
      <span>Campaign Builder</span>
      <div class="campaign-warning" v-if="currentCampaign && hasWarning" @click="findWarningStep"><img src="../assets/triangle.svg">This flow is incomplete</div>
      <div class="campaign-builder-control" v-if="currentCampaign" >
        Activate
        <template v-if="hasWarning">
          <el-tooltip
            effect="light"
            content="Please clear all warnings first"
            >
            <el-switch v-model="currentCampaign.isEnabled" :width="22" :disabled="true"></el-switch>
          </el-tooltip>
        </template>
        <template v-else>
          <el-switch v-model="currentCampaign.isEnabled" :width="22" :disabled="hasWarning"></el-switch>
        </template>
      </div>
      <el-popover class="campaign-builder-control" placement="bottom" trigger="hover" v-if="currentCampaign">
        <div class="campaign-builder-settings">
          <div class="campaign-builder-option" v-if="hasSteps">
            <el-switch v-model="allowReEnter" :width="22"></el-switch> Allow Re-entering campaign
          </div>
          <div class="campaign-builder-option" v-if="hasSteps">
            <el-switch v-model="messageRequestOnly" :width="22"></el-switch> Trigger message request only
          </div>
          <div class="campaign-builder-option" v-if="hasSteps">
            <el-switch v-model="nonSubscribersOnly" :width="22"></el-switch> Non-subscribers only
          </div>
          <div class="campaign-builder-option trash" @click="isDeleteDialog = true">
            <img src="../assets/svg/trash.svg"/> Delete campaign
          </div>
        </div>
        <div class="gear" slot="reference">
          <img src="../assets/svg/gear.svg"/>
        </div>
      </el-popover>
    </div> -->
    <div class="campaign-first-step" v-if="currentCampaign && !currentCampaign.steps.length">
      <div class="campaign-flow-choose">
        <div class="campaign-choose-info">
          Create
        </div>
        <div class="campaign-choose-buttons">
          <div class="campaign-choose-button">
            <add-step-popup @add-step="addStep" :available-list="availableElements">
              <span>New flow</span>
            </add-step-popup>
          </div>
          <!-- <div class="campaign-choose-button">Clone flow</div> -->
        </div>
        <div class="campaign-choose-info">
          You can also create a block by double clicking on the canvas
        </div>
      </div>
    </div>
    <flow-builder v-else :entry-item="currentCampaign" :has-warning="hasWarning" ref="flowBuilder"></flow-builder>
  </div>
</template>
<script>
import elementsPermissions from '../elements/permissions'
import ObjectId from '../utils/ObjectId'
import utils from '../utils'
import flowBuilder from '../component/flowBuilder.vue'
import addStepPopup from '../component/addStepPopup.vue'

export default {

  props: ['currentCampaign', 'hasWarning'],

  components: {
    flowBuilder,
    addStepPopup
  },

  computed:{
    availableElements() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.growthTools;

      return elementsPermissions.fromFlow.concat(messageTypes);
    },

    hasSteps() {
      const { steps } = this.currentCampaign;

      return steps && steps.length;
    },
  },

  methods: {
    addStep(element) {
      const step = {
        id: (new ObjectId).toString(),
        displaySettings: {
          isEntry: true
        },
        elements: []
      }

      step.elements.push( {
        id: (new ObjectId).toString(),
        ...element
      })

      this.currentCampaign.steps.push(step);
    },

    findEntryStep(warningStepId) {
      const { flowBuilder } = this.$refs;

      flowBuilder.findEntryStep(warningStepId.id);
    }
  },
}
</script>
<style lang="scss">
.campaign-builder-settings {
  color: #A9A9A9;

  .el-switch {
    margin-right: 10px;
    .el-switch__core {
      height: 14px;
      background-color: transparent;
      border: 2px solid currentColor;

      &:after {
        border: 2px solid currentColor;
        width: 4px;
        height: 4px;
        left: 2px;
      }
    }

    &.is-checked {
      .el-switch__core {
        border-color: #2E69F7;

        &:after {
          border-color: #2E69F7;
          left:100%;
          margin-left: -10px;
        }
      }
    }
  }

  .campaign-builder-option {
    display: flex;
    align-items: center;
    padding: 10px;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(#A9A9A9, .2);
    }

    &.trash {
      cursor: pointer;

      img {
        margin-right: 10px;
      }
    }
  }
}

.campaign-builder {
  flex-grow: 1;
  position: relative;
  background-color: #fafafa;
  width: 100%;
  height: 100%;

  .campaign-builder-controls {
    display: flex;
    padding: 8px 5px 7px 13px;
    align-items: center;
    background-color: #fff;
    color: #A9A9A9;
    box-shadow: 0 2px 14px rgba(0,0,0,.1);

    span {
      font-size: 24px;
      line-height: 24px;
      flex-grow: 1;
    }

    .campaign-warning {
      font-size: 18px;
      margin-right: 10%;
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        margin-right: 5px;
        width: 25px;
      }
    }

    .campaign-list {
      flex-grow: 1;
      text-align: center;

      .el-select {
        width: 100%;
        max-width: 300px;
      }
    }

    .campaign-builder-divider {
      border-left: 1px solid #A9A9A9;
      height: 34px;
      margin: 0 10px 0 38px;
    }

    span.campaign-builder-control {
      flex-grow: 0;
    }

    .campaign-builder-control {
      font-size: 18px;

      .el-switch {
        margin-left: 14px;

        .el-switch__core {
          height: 14px;
          background-color: transparent;
          border: 2px solid currentColor;

          &:after {
            border: 2px solid currentColor;
            width: 4px;
            height: 4px;
            left: 2px;
          }
        }

        &.is-checked {
          .el-switch__core {
            border-color: #2E69F7;

            &:after {
              border-color: #2E69F7;
              left:100%;
              margin-left: -10px;
            }
          }
        }
      }

      &.trash {
        padding: 8px;
        cursor: pointer;
      }

      .gear {
        padding: 0 8px;
        display: flex;
        cursor: pointer;
        align-items: center;

        img {
          width: 16px;
        }
      }
    }
  }

  .campaign-first-step {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 50px);

    .campaign-choose-buttons {
      background-color: #fff;
      border: 1px dashed #979797;
      padding: 0 10px;
      border-radius: 5px;
    }

    .campaign-choose-button {
      padding: 20px 90px;
      font-weight: bold;
      color: #979797;
      cursor: pointer;
      text-align: center;

      &:hover {
        color: #6A12CB;;
      }

      &:not(:last-child) {
        border-bottom: 1px dashed #979797;
      }
    }

    .campaign-choose-info {
      color: #979797;
      font-size: 11px;
      line-height: 25px;

      &.small {
        font-size: 9px;
      }
    }
  }

  .flow-builder {
    height: 100%;
  }
}

.el-dialog__wrapper.campaign-dialog {

  .el-dialog {
    border-radius: 5px;
    padding: 20px;
  }

  .el-dialog__header {
    padding: 0;
    font-size: 18px;
    line-height: 22px;
    font-weight: bold;
    text-align: center;
  }

  .el-dialog__body {
    padding: 0;

    input:not(.el-input__inner) {
      width: 100%;
      margin: 20px 0;
      font-size: 15px;
      line-height: 18px;
      padding: 4px 10px 6px;
      border: 1px solid #DBDBDB;

      &::placeholder {
        color: #A9A9A9;
        text-align: center;
      }
    }
  }

  .el-dialog__footer {
    padding: 0;

    button {
      background-color: #6A12CB;
      border-radius: 5px;
      line-height: 16px;
      font-weight: normal;
      padding: 7px 20px;

      &.cancel {
        background-color: transparent;
        color: #000;
      }
    }
  }
}

.add-disabled-popup > * {
  opacity: .3;
  pointer-events: none;
}
</style>
