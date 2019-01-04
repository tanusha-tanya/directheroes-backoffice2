<template>
  <div class="text-action">
    <el-input
      type="textarea"
      placeholder="Please input"
      :autosize="{ minRows: 5, maxRows: 10}"
      v-model="element.value.text"
    >
    </el-input>
  </div>
</template>
<script>
export default {
  props:['element']
}
</script>
<style lang="scss">
.text-action {
  padding: 9px 20px 13px;

  .el-textarea {
    .el-textarea__inner {
      resize: none;
      font-family: 'AbeatbyKai';
      font-size: 15px;

      &:focus {
        border-color: #c0c4cc;
      }
    }
  } 
}
</style>
