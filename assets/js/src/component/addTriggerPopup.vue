<template>
  <el-popover popper-class="add-trigger-popup" :disabled="!hasAvailableTriggers" placement="right" v-model="isShow" trigger="hover">
    <template slot="reference">
      <span :class="{'add-disabled-popup': !hasAvailableTriggers}">
        <slot></slot>
      </span>
    </template>
    <template v-for="trigger in triggers">
      <div
        :class="{'trigger-item':true, 'trigger-disabled': availableList && !availableList.includes(triggerType(trigger))}"
        :key="trigger.title"
        @click="selectTrigger(trigger)">
          {{trigger.title}}
      </div>
    </template>
  </el-popover>
</template>

<script>
import triggers from '../elements/triggers'

export default {
    data() {
      return {
        isShow: false,
        triggers,
      };
    },

    props: ['availableList'],

    computed: {
      hasAvailableTriggers() {
        const { availableList, triggerType, triggers } = this;

        if (!availableList) return true;

        return triggers.some(trigger => {
          return availableList.includes(triggerType(trigger))
        })
      }
    },

    methods: {
      triggerType(element) {
        const { value, entity, operand } = element.template.condition;

        if (['postReply', 'adReply', 'storyReply', 'storyMention', 'mediaShare'].includes(value)) {
          return value;
        } else if (entity === 'message' && operand === 'contains') {
          return 'list'
        }
      },

      selectTrigger(trigger) {
        this.$emit('on-select', JSON.parse(JSON.stringify(trigger.template)));
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

      &.trigger-disabled {
        opacity: .3;
        pointer-events: none;
      }
    }
  }
</style>
