<template>
  <el-dialog 
  title="Reply preview"
  :visible.sync="showPreview"
  width="450px"
  custom-class="preview-replie-dialog">
    <div class="message-container">
      <div class="replie-message" v-if="reply" v-html="reply.previewText.replace(/\n/ig, '<br />')"></div>
    </div>  
  </el-dialog>
</template>
<script>
import { Dialog } from 'element-ui'

export default {
  components: {
    'el-dialog': Dialog,
  },

  props: ['reply'],

  computed: {
    showPreview: {
      get() {
        return Boolean(this.reply)
      },
      set(value) {
        this.$emit('close');
      }
    }
  },

  watch: {
    replie(value) {
      if (!value) return;

      this.$nextTick(() => {
        this.$el
          .querySelector('.el-dialog__body')
          .addEventListener('scroll', event => {
            event.preventDefault();
            return false;
          });
      })
    }
  }
}
</script>
<style lang="scss">
.preview-replie-dialog {
  max-height: 70%;
  display: flex;
  flex-direction: column;

  .el-dialog__header {
    margin-bottom: 15px;
  }

  .el-dialog__body {
    overflow-x: hidden;
    overflow-y: auto; 
    height: calc(100% - 50px);

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-button {
      width: 0px;
      height: 0px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #d2d2d2;
      border: 0px none #ffffff;
      border-radius: 50px;
      transition: .2s background-color
    }

    &::-webkit-scrollbar-thumb:hover, &::-webkit-scrollbar-thumb:active {
      background-color: #a4a4a4;
    }

    &::-webkit-scrollbar-track {
      background-color: #f8f8f8;
      border: 0px none #ffffff;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-track:hover, &::-webkit-scrollbar-track:active {
      background: #ffffff;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }

  .message-container {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
  }

  .replie-message {
    padding: 15px;
    border: 1px solid #EFEFEF;
    border-radius: 25px;
    line-height: 22px;
    font-size: 16px;
    background-color: #EFEFEF;
    max-width: 70%;
    margin-top: 70px;
    word-wrap: break-word;
  }
}
</style>

