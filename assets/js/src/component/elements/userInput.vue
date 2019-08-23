<template>
  <div class="user-input-items">
    <el-select >
      <el-option></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: ['elements'],

  methods: {

  }
}
</script>

<style lang="scss">
  .user-input-items {
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    border: 1px solid #D8D8D8;
    padding: 10px;
  }
</style>