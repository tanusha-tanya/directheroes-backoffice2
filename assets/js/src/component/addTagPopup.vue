<template>
<el-popover popper-class="add-tag-popup" placement="right" v-model="isShow" trigger="click">
  <template slot="reference">
    <span class="add-step-button">
      <slot></slot>
    </span>
  </template>
  <div class="action-item" @click="addNewStep(addTagElement.template)">
    {{addTagElement.title}}
  </div>
  <add-step-popup class="action-item" @add-step="addNewStep" :available-list="availableList">
    <span>Skip Add tag</span>
  </add-step-popup>
</el-popover>
</template>

<script>
import addStepPopup from './addStepPopup';
import actions from '../elements/actions';

export default {
  data() {
    return {
      isShow: false,
      actions,
    }
  },

  components: {
    addStepPopup
  },

  props: ['availableList'],

  computed: {
    addTagElement() {
      const { actions } = this;

      return actions.find(action => action.template.body.action === 'addCategory')
    }
  },

  methods: {
    addNewStep(element) {
      this.$emit('add-step', JSON.parse(JSON.stringify(element)));
      this.isShow = false;
    },
  }
}
</script>

<style lang="scss">
.add-tag-popup {
  padding: 0;
  border: 1px solid #CFCFCF;

  .action-item {
    padding: 10px;
    display: block;
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
