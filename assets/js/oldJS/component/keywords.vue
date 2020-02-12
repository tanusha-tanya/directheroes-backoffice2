<template>
  <div class="keywords">
    <el-select
      :value="value"
      :placeholder="placeholder || 'Matches any text, click to edit'"
      :popper-class="list ? '' : 'keywords-dropdown'"
      multiple
      filterable
      :allow-create="isAllowCreate"
      default-first-option
      @change="keywordsChange"
      @keydown.native="keywordsKeydown"
    >
      <template v-if="list">
        <el-option v-for="(item, index) in list" :key="index" :value="item" :label="item"></el-option>
      </template>
    </el-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      intermediateValue: '',
      isActionRename: false,
      newValue: '',
    }
  },

  props: ['value', 'placeholder', 'list', 'isAllowCreate'],

  methods: {
    keywordsChange(value) {
      this.$emit('change', value);
      this.$emit('input', value.filter(keyword => keyword.trim()));

      this.newValue = '';
    },

    keywordsKeydown(event) {
      const { target } = event;
      const { value, isAllowCreate } = this;

      if ([188, 9].includes(event.keyCode)) {

        if (!target.value) {
          target.value = '';
          return;
        }

        event.preventDefault();

        if (value.includes(target.value)) {
          value.splice(value.indexOf(target.value), 1)
        } else {
          value.push(target.value.replace(',', ''));
        }

        target.value = '';

        return false;
      }

      if (isAllowCreate) {
        this.newValue = target.value;
      }
    }
  }
}
</script>
<style lang="scss">
  .keywords {
    background-color: #fff;

    .el-select {
      width: 100%;
    }

    .tag-item {
      font: 9px 'AbeatbyKai';
      color: #A9A9A9;
      padding: 0 7px;
      line-height: 9px;
      cursor: pointer;
      position: relative;
      z-index: 10;

      &:hover {
        color:#2A3E98;
      }
    }

    .el-select__input {
      min-width: 30%;
    }

    .el-input__inner {
      padding: 0;
      border: none;
      background-color: transparent;
    }

    .el-select__tags {
      top: 4px;
      transform: translateY(0);
      max-width: 100% !important;
    }

    .el-tag {
      background-color: #5CA6A6;
      color: #fff;
      border-radius: 20px;
      padding: 2px 10px 3px;
      height: auto;
      line-height: 14px;
      white-space: normal;
      word-break: break-word;
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

      &::placeholder {
        opacity: 0;
      }
    }

    .el-input__suffix {
      display: none;
    }
  }

  .keywords-dropdown {
    display: none;
  }
</style>

