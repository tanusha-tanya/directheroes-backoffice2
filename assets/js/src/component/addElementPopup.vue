<template>
    <el-popover popper-class="add-element-popup" placement="right" trigger="click" v-model="isShow">
      <template slot="reference">
        <slot></slot>
      </template>
      <div class="favorite-elements">
        <!-- <div class="element-item" v-for="action in actions" :key="action.title">
          {{action.title}}
        </div> -->
      </div>
      <div class="types-of-elements">
        <div class="type-of-element trigger-elements">
          <add-triggers-popup @on-select="selectElement">
            <span>Triggers</span>
          </add-triggers-popup>
        </div>
        <div class="type-of-element action-elements" v-if="false">
          <add-action-popup @on-select="selectElement" >
            <span>Actions</span>
          </add-action-popup>
        </div>
      </div>
    </el-popover>
</template>

<script>
import addTriggersPopup from './addTriggerPopup'
import addActionPopup from './addActionPopup'

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
      this.$emit('add-element', element);
      this.isShow = false;
    }
  }
}
</script>

<style lang="scss">
.add-element-popup {
  padding: 0;
  border: 1px solid #CFCFCF;
  min-width: 255px;

  .favorite-elements {
    display: flex;
    flex-wrap: wrap;
    padding: 9px;
    margin: -3px;

    .element-item {
      width: 54px;
      height: 54px;
      border: 1px solid #D8D8D8;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      font-size: 9px;
      color: #828282;
      margin: 3px;
      cursor: pointer;

      &:hover {
        color: #6A12CB;
        border-color: #6A12CB;
      }
    }
  }

  .types-of-elements {
    padding: 9px;
    border-top: 1px solid #D5D5D5;
    display: flex;

    .type-of-element {
      flex-grow: 1;

      border: 1px solid #D8D8D8;
      border-radius: 5px;
      text-align: center;
      font-size: 9px;
      color: #828282;
      cursor: pointer;

      &:first-child {
        margin-right: 4px;
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
</style>
