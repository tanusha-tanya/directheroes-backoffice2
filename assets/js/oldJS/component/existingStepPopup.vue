<template>
<el-popover popper-class="exisitng-step-popup" placement="right" v-model="isShow" trigger="hover">
  <template slot="reference">
    <slot></slot>
  </template>
    <div class="action-item" @click="emitAction('find-step')">
      Show target step
    </div>
    <div class="action-item" @click="emitAction('unbind-step')">
      Unbind
    </div>
</el-popover>
</template>

<script>

export default {
  data() {
    return {
      isShow: false,
    }
  },

  methods: {
    emitAction(actionName) {
      this.$emit(actionName);
      this.isShow = false;
    },
  }
}
</script>

<style lang="scss">
.exisitng-step-popup {
  padding: 0;
  border: 1px solid #CFCFCF;

  .action-item {
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: #F8F8F8;
    }
  }
}
</style>
