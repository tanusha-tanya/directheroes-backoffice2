<template>
  <div class="action-items">
    <template v-for="action in elements">
      <div class="action-item" v-if="action.body.action === 'sendText'" :key="action.id">
        <el-input
          type="textarea"
          placeholder="Please input"
          :autosize="{ minRows: 3, maxRows: 10}"
          v-model="action.body.text"
        >
        </el-input>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ['elements']
}
</script>

<style lang="scss">
.action-items {
  background-color: #fff;
  border: 1px solid #D8D8D8;
  border-top: 0;
  border-radius: 0 0 5px 5px;
  padding: 19px;

  .action-item {
    .el-textarea {
      .el-textarea__inner {
        resize: none;
        border: none;
        background-color: #F2F2F2;
        border-radius: 7px;

        &:focus {
          border-color: transparent;
        }
      }
    }
  }
}
</style>
