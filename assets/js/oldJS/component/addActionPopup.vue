<template>
<el-popover popper-class="add-action-popup" :disabled="!hasAvailableAction" placement="right" v-model="isShow" trigger="hover">
  <template slot="reference">
    <span :class="{'add-step-item': true, 'add-disabled-popup': !hasAvailableAction}">
      <slot></slot>
    </span>
  </template>
  <template v-for="action in actions">
    <div
      :class="{'action-item':true, 'action-disabled': availableList && !availableList.includes(actionType(action))}"
      :key="action.title"
      @click="selectAction(action)">
      {{action.title}}
    </div>
  </template>
</el-popover>
</template>

<script>
import actions from '../elements/actions';

export default {
  data() {
    return {
      isShow: false,
      actions,
    }
  },

  props: ['availableList'],

  computed: {
    hasAvailableAction() {
      const { availableList, actions, actionType } = this;

      if (!availableList) return true;

      return actions.some(action => {
        return availableList.includes(actionType(action))
      })
    }
  },

  methods: {
    selectAction(action) {
      this.$emit('on-select', JSON.parse(JSON.stringify(action.template)));
      this.isShow = false;
    },

    actionType(element) {
      const { template } = element;

      return template.displaySettings.type || template.body.action;
    }
  }
}
</script>

<style lang="scss">
.add-action-popup {
  padding: 0;
  border: 1px solid #CFCFCF;

  .action-item {
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: #F8F8F8;
    }

    &.action-disabled {
      opacity: .3;
      pointer-events: none;
    }
  }
}
</style>
