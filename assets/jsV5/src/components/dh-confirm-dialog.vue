<template>
  <el-dialog
    :visible.sync="isShow"
    :title="title"
    width="554px"
    append-to-body
    class="dh-confirm-dialog"
  >
    <div class="dialog-text">{{ message }}</div>
    <template slot="footer">
      <button class="dh-button" @click="$emit('success')">Delete</button>
      <button class="dh-button dh-reset-button" @click="cancelHandler">Cancel</button>
    </template>
  </el-dialog>
</template>

<script>
export default {
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