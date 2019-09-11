<template>
  <el-popover popper-class="add-mid-step-popup" placement="right" v-model="isShow" trigger="click">
    <div class="add-step-button" slot="reference">
      <slot></slot>
    </div>
    <div
      class="action-item"
      @click="selectElement(action)">
      Add tag
    </div>
    <add-step-popup
      v-if="false"
      :available-list="availableList"
      @add-step="selectElement($event)"
    >
      <div
        class="action-item">
        Skip add tag
      </div>
    </add-step-popup>

  </el-popover>
</template>

<script>
import actions from '../elements/actions';
import addStepPopup from './addStepPopup';

export default {
  data() {
    return {
      isShow: false,
    }
  },

  props:['availableList'],

  components: {
    addStepPopup
  },

  computed: {
    action() {
      const addTagAction = actions.find(action => action.template.body.action == 'addCategory');

      return addTagAction.template
    }
  },

  methods: {
    selectElement(element) {
      this.$emit('add-step', JSON.parse(JSON.stringify(element)));
      this.isShow = false;
    }
  }
}
</script>

<style lang="scss">
.add-mid-step-popup {
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