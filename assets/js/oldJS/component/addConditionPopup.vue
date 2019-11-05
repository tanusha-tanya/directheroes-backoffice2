<template>
<el-popover popper-class="add-condition-popup" :disabled="!hasAvailableCondition" placement="right" v-model="isShow" trigger="hover">
  <template slot="reference">
    <span :class="{'add-disabled-popup': !hasAvailableCondition}">
      <slot></slot>
    </span>
  </template>
  <template v-for="condition in conditions">
    <div
      :class="{'condition-item':true, 'condition-disabled': availableList && !availableList.includes(condition.template.displaySettings.type)}"
      :key="condition.title"
      @click="selectAction(condition)">
      {{condition.title}}
    </div>
  </template>
</el-popover>
</template>

<script>
import conditions from '../elements/conditions';

export default {
  data() {
    return {
      isShow: false,
      conditions,
    }
  },

  props: ['availableList'],

  computed: {
    hasAvailableCondition() {
      const { availableList, conditions } = this;

      if (!availableList) return true;

      return conditions.some(condition => {
        return availableList.includes(condition.template.displaySettings.type)
      })
    }
  },

  methods: {
    selectAction(action) {
      this.$emit('on-select', JSON.parse(JSON.stringify(action.template)));
      this.isShow = false;
    }
  }
}
</script>

<style lang="scss">
.add-condition-popup {
  padding: 0;
  border: 1px solid #CFCFCF;

  .condition-item {
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: #F8F8F8;
    }

    &.condition-disabled {
      opacity: .3;
      pointer-events: none;
    }
  }
}
</style>
