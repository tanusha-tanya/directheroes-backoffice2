<template>
  <div class="builder-card-dialogs">
    <div class="delay-info" v-if="delayInfo">
      <img width="10" height="10" src="../assets/svg/stopwatch-w.svg"/>
      {{ delayInfo }}
    </div>
    <el-dropdown trigger="click" @command="setActionType">
      <img src="../assets/svg/edit.svg"/>
      <el-dropdown-menu class="action-list" slot="dropdown">
        <el-dropdown-item command="rename">Rename</el-dropdown-item>
        <el-dropdown-item command="delay" v-if="!short" divided>Add delay</el-dropdown-item>
      </el-dropdown-menu> 
    </el-dropdown>
    <el-dialog
      :visible.sync="isActionRename"
      title="Rename Campaign"
      width="321px"
      append-to-body
      class="action-dialog"
      :show-close="false"
    >
      <input v-model="intermediateValue" placeholder="Enter Campaign name"/>
      <template slot="footer">
        <button @click="saveChanges">Save</button>
        <button class="cancel" @click="actionType = null">Close</button>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="isActionDelay"
      title="Add delay"
      width="321px"
      append-to-body
      class="action-dialog"
      :show-close="false"
    >
      <basic-delay :element="intermediateValue"></basic-delay>
      <template slot="footer">
        <button @click="saveChanges">Save</button>
        <button class="cancel" @click="actionType = null">Close</button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import ObjectId from '../utils/ObjectId'
import utils from '../utils'
import basicDelay from './elements/basicDelay.vue'

export default {
  data() {
    return {
      actionType: null,
      intermediateValue: null,
    }
  },

  props:['step', 'short'],

  components: {
    basicDelay
  },

  computed: {
    isActionRename: {
      get() {
        return this.actionType === 'rename'
      },
      set() {
        this.actionType = null;
      }
    },

    isActionDelay: {
      get() {
        return this.actionType === 'delay'
      },
      set() {
        this.actionType = null;
      }
    },

    delayInHeader() {
      const { step } = this;

      return (step.elements || []).find( element => element.type == 'basicDelay' && element.displaySettings.visible == false)
    },

    delayInfo() {
      const { delayInHeader } = this;
      
      if (!delayInHeader || !delayInHeader.value.seconds) return;

      const { seconds } = delayInHeader.value;
      const timeType = utils.secondsToTimeType(seconds);

      return utils.timeFromSeconds(seconds, timeType) + timeType[0]
    }
  },

  methods: {
    setActionType(type) {
      const { step } = this;

      switch (type) {
        case 'delay':
          let element = this.delayInHeader;

          if (!element) {
            element = {
              id: (new ObjectId).toString(),
              type: 'basicDelay',
              value: {
                seconds: 0
              },
              displaySettings: {
                visible: false
              }
            }

            step.elements.push(element)
          }

          this.intermediateValue = JSON.parse(JSON.stringify(element));
          break;
      
        case 'rename':
          this.intermediateValue = step.name;
          break;
      }

      this.actionType = type;
    },

    saveChanges() {
      const { step } = this;

      switch (this.actionType) {
        case 'delay':
          const { seconds } = this.intermediateValue.value;
          let element = step.elements.find( element => element.type == 'basicDelay' && element.displaySettings.visible == false)

          element.value.seconds = seconds;
          break;

        case 'rename':
          step.name = this.intermediateValue;
          break;
      }

      this.actionType = null;
    }
  }
}
</script>
<style lang="scss">
  .builder-card-dialogs {
    display: flex;
    align-items: center;

    .delay-info {
      margin-right: 10px;
      font-size: 12px;
    }

    .el-dropdown {
      img {
        cursor: pointer;
      }
    }
  }

  .el-dropdown-menu.action-list {
    margin-left: 6px;
    margin-top: 5px;
    padding: 0;

    .el-dropdown-menu__item {
      line-height: 30px;
    }

    .el-dropdown-menu__item--divided {
      &:before {
        display: none;
      }

      margin: 0;
    }
  }

  .el-dialog__wrapper.action-dialog {
    
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

    .basic-delay {
      padding: 20px 0;
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
</style>
