<template>
 <el-dialog
    :visible.sync="isShow"
    :title="title"
    width="321px"
    append-to-body
    class="action-dialog"
    :show-close="false"
  >
    <div class="dialog-text">{{ message }}</div>
    <template slot="footer">
      <button @click="$emit('success')">Delete</button>
      <button class="cancel" @click="cancelHandler">Cancel</button>
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
