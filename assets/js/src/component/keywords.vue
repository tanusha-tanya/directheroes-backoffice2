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
  .keywords {
    .el-input__inner {
      padding-right: 0;
      border-color: #DDDDDD;
      border-radius: 8px;
      min-height: 68px;
    }

    .el-select__tags {
      top: 4px;
      transform: translateY(0); 
    }

    .el-tag {
      background-color: #2A3E98;
      color: #fff;
      border-radius: 20px;
      padding: 4px 15px 5px;
      height: auto;
      line-height: 14px;
    }

    .el-tag__close {
      background-color: transparent !important;

      &:hover {
        background-color: transparent !important;
      }

      &:before {
        transform: translate(0,2.7px) !important;
      }
    }

    .el-input.is-focus .el-input__inner {
      border-color: #c0c4cc;
    }

    .el-input__suffix {
      display: none;
    }
  }

  .keywords-dropdown {
    display: none;
  }
</style>

