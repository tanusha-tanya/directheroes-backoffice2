<template>
<el-popover popper-class="add-message-popup" :disabled="!hasAvailableMessage" placement="right" v-model="isShow" trigger="hover">
  <template slot="reference">
    <span :class="{'add-step-item': true, 'add-disabled-popup': !hasAvailableMessage}">
      <slot></slot>
    </span>
  </template>
  <template v-for="message in messages">
    <div
      :class="{'message-item':true, 'message-disabled': availableList && !availableList.includes(message.template.displaySettings.type || message.template.body.action)}"
      :key="message.title"
      @click="selectAction(message)">
      {{message.title}}
    </div>
  </template>
</el-popover>
</template>

<script>
import messages from '../elements/messages';
import conditions from '../elements/conditions';

export default {
  data() {
    return {
      isShow: false,
      messages
    }
  },

  props: ['availableList'],

  computed: {
    hasAvailableMessage() {
      const { availableList, messages } = this;

      if (!availableList) return true;

      return messages.some(message => {
        return availableList.includes(message.template.displaySettings.type || message.template.body.action)
      })
    }
  },

  methods: {
    selectAction(message) {
      this.$emit('on-select', JSON.parse(JSON.stringify(message.template)));
      this.isShow = false;
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
      display: none;
      opacity: .3;
      pointer-events: none;
    }
  }
}
</style>
