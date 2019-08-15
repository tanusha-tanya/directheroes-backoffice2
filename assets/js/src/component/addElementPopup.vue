<template>
  <el-popover popper-class="add-element-popup" placement="right" trigger="click" v-model="isShow">
    <template slot="reference">
      <slot></slot>
    </template>
    <div class="favorite-elements">
      <div :class="{'element-item': true, 'element-disabled': !availableList.includes(getActionElement(action).body.action)}" v-for="action in actions" :key="action.title" @click="selectElement(action.template)">
        {{action.title}}
      </div>
    </div>
    <div class="types-of-elements">
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
    </div>
  </el-popover>
</template>

<script>
import addTriggerPopup from './addTriggerPopup'
import addActionPopup from './addActionPopup'

export default {
  data() {
    return {
      isShow: false,
      actions: [
        {
          title: 'Text',
          template: {
            type: 'action',
            displaySettings: {
              subType: 'message'
            },
            body: {
              action: 'sendText',
              text: ''
            }
          }
        },
        {
          title: 'Image',
          template: {
            type: 'action',
            displaySettings: {
              subType: 'message'
            },
            body: {
              action: 'sendMedia',
            }
          }
        },
        {
          title: 'Delay',
          template: {
            type: 'group',
            displaySettings: {
              type: 'delay',
              subType: 'message'
            },
            elements: [
              {
                type: 'action',
                body: {
                  action: 'registerTimeout',
                  delta: 300
                }
              },
              {
                type: 'checkpoint'
              },
              {
                type: 'rule',
                condition: {
                  entity: 'time',
                  field: 'delta',
                  operand: 'eq',
                  value: 300
                },
                onMatch: {
                  action: 'fallthrough'
                }
              },
            ]
          }
        }
      ]
    }
  },

  components: {
    addTriggerPopup,
    addActionPopup
  },

  computed: {
    availableList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.triggers;

      return ['sendText', 'sendMedia'].concat(messageTypes)
    }
  },

  methods: {
    selectElement(element) {
      this.$emit('add-element', JSON.parse(JSON.stringify(element)));
      this.isShow = false;
    },

    getActionElement(message) {
      if (message.template.type === 'group') {
        return message.template.elements.find(element => element.type === 'action')
      } else {
        return message.template
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
      justify-content: center;
      align-items: flex-end;
      font-size: 9px;
      color: #828282;
      margin: 3px;
      cursor: pointer;

      &:hover {
        color: #6A12CB;
        border-color: #6A12CB;
      }
    }
  }

  .types-of-elements {
    padding: 9px;
    border-top: 1px solid #D5D5D5;
    display: flex;

    .type-of-element {
      flex-grow: 1;

      border: 1px solid #D8D8D8;
      border-radius: 5px;
      text-align: center;
      font-size: 9px;
      color: #828282;
      cursor: pointer;

      &:first-child {
        margin-right: 4px;
      }

      &.trigger-elements:hover {
        border-color: #7EC6C6;
        color: #7EC6C6;
        background-color: #F8F8F8;
      }

      &.action-elements:hover {
        border-color: #F4B109;
        color: #F4B109;
        background-color: #F8F8F8;
      }

      .el-popover__reference {
        display: block;
        width: 100%;
        padding: 11px;
      }
    }
  }
}
</style>
