<template>
    <el-popover popper-class="add-trigger-popup" placement="right" v-model="isShow" trigger="hover">
        <template slot="reference">
            <slot></slot>
        </template>
        <div
                class="trigger-item"
                v-for="trigger in triggers"
                :key="trigger.title"
                @click="selectTrigger(trigger)">
            {{trigger.title}}
        </div>
    </el-popover>
</template>

<script>
  export default {
    data() {
      return {
        isShow: false,
        triggers: [
          {
            title: 'Keywords',
            template: {
              type: 'rule',
              condition: {
                entity: 'message',
                field: 'text',
                operand: 'contains',
                value: [],
              },
              onFail: {
                action: 'fallthrough',
              },
            },
          },
          {
            title: 'Media Share',
            template: {
              type: 'rule',
              condition: {
                entity: 'message',
                field: 'text',
                operand: 'contains',
                value: [],
              },
              onFail: {
                action: 'fallthrough',
              },
            },
          },
          {
            title: 'Post Reply',
            template: {
              type: 'rule',
              condition: {
                entity: 'message',
                field: 'text',
                operand: 'contains',
                value: [],
              },
              onFail: {
                action: 'fallthrough',
              },
            },
          },
          {
            title: 'Engagements',
            template: {
              type: 'rule',
              condition: {
                entity: 'message',
                field: 'text',
                operand: 'contains',
                value: [],
              },
              onFail: {
                action: 'fallthrough',
              },
            },
          },
          {
            title: 'Story Mentions',
            template: {
              type: 'rule',
              condition: {
                entity: 'message',
                field: 'text',
                operand: 'contains',
                value: [],
              },
              onFail: {
                action: 'fallthrough',
              },
            },
          },
          {
            title: 'Ad Reply',
            template: {
              type: 'rule',
              condition: {
                entity: 'message',
                field: 'text',
                operand: 'contains',
                value: [],
              },
              onFail: {
                action: 'fallthrough',
              },
            },
          },
          {
            title: 'Webhooks',
            template: {
              type: 'rule',
              condition: {
                entity: 'message',
                field: 'text',
                operand: 'contains',
                value: [],
              },
              onFail: {
                action: 'fallthrough',
              },
            },
          },
        ],
      };
    },

    methods: {
      selectTrigger(trigger) {
        this.$emit('on-select', trigger.template);
        this.isShow = false;
      },
    },
  };
</script>

<style lang="scss">
    .add-trigger-popup {
        padding: 0;
        border: 1px solid #CFCFCF;

        .trigger-item {
            padding: 10px;
            cursor: pointer;

            &:hover {
                background-color: #F8F8F8;
            }
        }
    }
</style>
