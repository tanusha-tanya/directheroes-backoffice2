<template>
  <el-select
    class="keywords" 
    :value="value"
    placeholder="Enter messages"
    popper-class="keywords-dropdown"
    multiple
    filterable
    allow-create
    default-first-option
    @change="keywordsChange"
  >
  </el-select>
</template>
<script>
export default {
  props: ['value'],

  methods: {
    keywordsChange(value) {
      this.$emit('input', value.filter(keyword => keyword.trim()))
    }
  }
}
</script>
<style lang="scss">
  .keywords-dropdown {
    display: none;
  }
</style>

