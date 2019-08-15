<template>
<el-popover popper-class="add-message-popup" :disabled="!hasAvailableMessage" placement="right" v-model="isShow" trigger="hover">
  <template slot="reference">
    <span :class="{'add-disabled-popup': !hasAvailableMessage}">
      <slot></slot>
    </span>
  </template>
  <template v-for="message in messages">
    <div
      :class="{'message-item':true, 'message-disabled': availableList && !availableList.includes(getActionElement(message).body.action)}"
      :key="message.title"
      @click="selectAction(message)">
      {{message.title}}
    </div>
  </template>
</el-popover>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      messages: [
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

  props: ['availableList'],

  computed: {
    hasAvailableMessage() {
      const { availableList, messages, getActionElement } = this;

      if (!availableList) return true;

      return messages.some(message => {
        return availableList.includes(getActionElement(message).body.action)
      })
    }
  },

  methods: {
    selectAction(message) {
      this.$emit('on-select', JSON.parse(JSON.stringify(message.template)));
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
.add-message-popup {
  padding: 0;
  border: 1px solid #CFCFCF;

  .message-item {
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: #F8F8F8;
    }

    &.message-disabled {
      opacity: .3;
      pointer-events: none;
    }
  }
}
</style>
