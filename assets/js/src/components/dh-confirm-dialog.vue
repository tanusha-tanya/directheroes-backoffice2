<template>
  <el-dialog
    :visible.sync="isShow"
    :title="title"
    width="554px"
    append-to-body
    class="dh-confirm-dialog"
    @close="inProgress = false"
  >
    <div class="dialog-text">{{ message }}</div>
    <template slot="footer">
      <button :class="{'dh-button': true, 'dh-loading': inProgress}" :disabled="inProgress" @click="successHandler">Delete</button>
      <button class="dh-button dh-reset-button" :disabled="inProgress" @click="cancelHandler">Cancel</button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      inProgress: false,
    }
  },

  props: ['value', 'message', 'title'],

  computed: {
    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    }
  },

  methods: {
    cancelHandler() {
      this.$emit('cancel'),
      this.isShow = false
    },

    successHandler() {
      this.$emit('success');
      this.inProgress = true;
    }

  }
}
</script>

<style lang="scss">
  .dh-confirm-dialog {
    .el-dialog__footer {
      display: flex;
      justify-content: space-between;
    }
  }
</style>