<template>
  <div class="subscribe-action">
    <el-select
      size="small"
      v-model="element.value.action"
    >
      <el-option label="Subscribe" value="subscribe"></el-option>
      <el-option label="Unsubscribe" value="unsubscribe"></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props:['element']
}
</script>
<style lang="scss">
.subscribe-action {
  padding: 9px 20px 13px;

  .el-select {
    width: 100%;
  }
}
</style>
