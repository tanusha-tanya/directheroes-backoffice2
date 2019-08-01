<template>
  <el-popover popper-class="add-step-popup" placement="right" v-model="isShow" trigger="click">
    <div class="add-step-button" slot="reference">
    </div>
    <div class="types-of-elements">
      <div class="type-of-element trigger-elements" v-if="false">
        <add-triggers-popup @on-select="selectElement" >
          <span>Triggers</span>
        </add-triggers-popup>
      </div>
      <div class="type-of-element action-elements">
        <add-action-popup @on-select="selectElement">
          <span>Actions</span>
        </add-action-popup>
      </div>
    </div>
  </el-popover>
</template>

<script>
import addTriggersPopup from './addTriggerPopup';
import addActionPopup from './addActionPopup';

export default {
  data() {
    return {
      isShow: false,
    }
  },

  components: {
    addTriggersPopup,
    addActionPopup
  },

  methods: {
    selectElement(element) {
      this.$emit('add-step', element);
      this.isShow = false;
    }
  }
}
</script>

<style lang="scss">
  .add-step-popup {
    .types-of-elements {
      .type-of-element {
        width: 100%;
        border: 1px solid #D8D8D8;
        border-radius: 5px;
        text-align: center;
        font-size: 12px;
        color: #828282;
        cursor: pointer;

        &:first-child {
          margin-bottom: 4px;
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

  .add-step-button {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #fff;
  }
</style>
