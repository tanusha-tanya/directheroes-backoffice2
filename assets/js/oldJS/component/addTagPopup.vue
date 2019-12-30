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
  <add-step-popup class="action-item" :builder="builder" :link-element="linkElement" :available-list="availableList" @select="selectHandler">
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

  props: ['availableList', 'linkElement', 'builder'],

  computed: {
    addTagElement() {
      const { actions } = this;

      return actions.find(action => action.template.body.action === 'addCategory')
    }
  },

  methods: {
    addNewStep(element) {
      const { builder, linkElement } = this;

      this.$emit('select', element);
      this.isShow = false;

      if (!linkElement) return;

      builder.addStep(linkElement,  JSON.parse(JSON.stringify(element)));
    },

    selectHandler(element) {
      this.$emit('select', element);
      this.isShow = false;
    }
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
