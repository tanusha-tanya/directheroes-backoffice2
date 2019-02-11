<template>
  <div class="keywords">
    <el-select
      :value="value"
      placeholder="Enter messages"
      popper-class="keywords-dropdown"
      multiple
      filterable
      allow-create
      default-first-option
      @change="keywordsChange"
      @keydown.native="keywordsKeydown"
    >
    </el-select>
    <div v-if="tagPrefix" class="tag-item" @click="tagNameSet">#{{tagPrefix}}<span v-if="tagName">_</span>{{tagName}}</div>
    <el-dialog
      :visible.sync="isActionRename"
      title="Rename tag"
      width="321px"
      append-to-body
      class="action-dialog"
      :show-close="false"
    >
      <input v-model="intermediateValue" placeholder="Enter Tag name" maxlength="20"/>
      <template slot="footer">
        <button @click="saveChanges">Save</button>
        <button class="cancel" @click="isActionRename = false">Close</button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      intermediateValue: '',
      isActionRename: false,
    }
  },

  props: ['value', 'tag-prefix', 'tag-name'],

  methods: {
    keywordsChange(value) {
      this.$emit('input', value.filter(keyword => keyword.trim()))
    },

    keywordsKeydown(event) {
      const { target } = event;
      const { value } = this;

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
    },

    tagNameSet() {
      this.intermediateValue = this.tagName;
      this.isActionRename = true;
    },

    saveChanges() {
      this.isActionRename = false;

      this.$emit('set-tag-name', this.intermediateValue);
    }
  }
}
</script>
<style lang="scss">
  .keywords {
    border: 1px solid #DDDDDD;
    border-radius: 8px;
    background-color: #fff;

    .tag-item {
      font: 9px 'AbeatbyKai';
      color: #A9A9A9;
      padding: 0 7px;
      line-height: 9px;
      cursor: pointer;
      &:hover {
        color:#2A3E98;
      }
    }

    .el-input__inner {
      padding-right: 0;
      border: none;
      // border-color: #DDDDDD;
      // border-radius: 8px;
      min-height: 68px;
      background-color: transparent;
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

