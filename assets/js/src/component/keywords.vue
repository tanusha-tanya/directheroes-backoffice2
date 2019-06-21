<template>
  <div :class="['keywords', messageType]">
    <el-select
      :value="value"
      placeholder="Matches any text, click to edit"
      popper-class="keywords-dropdown"
      multiple
      filterable
      allow-create
      default-first-option
      @change="keywordsChange"
      @keydown.native="keywordsKeydown"
    >
    </el-select>
    <slot></slot>
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

  props: ['value', 'tag-prefix', 'tag-name', 'message-type'],

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

    &.adReply, &.postShare {
      position: absolute !important;
      top: 37px;
      width: 37px !important;
      right: 0px;
      height: 40px;
      border-color: transparent;
      background-color: transparent;

      .el-select {
        display: none;
      }

      .tag-item {
        display: none;
      }

      img.element-warning {
        right: 12px !important;
        top: 8px !important;
      }

      .list-condition-container {
        z-index: 5;
      }
    }

    &.storyMention, &.storyShare, &.mediaShare {
      position: absolute !important;
      top: 17px;
      width: 37px;
      right: -11px;
      height: 0;
      border-color: transparent;
      background-color: transparent;

      .el-select {
        display: none;
      }

      .tag-item {
        display: none;
      }

      img.element-warning {
        right: 38px !important;
        top: -13px !important;
      }

      .list-condition-container {
        z-index: 5;
      }

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

