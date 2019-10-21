<template>
  <div class="dh-question-mark">
    <div class="dh-question-mark-icon" @click="isShow = true">
      <support/>
    </div>
    <el-dialog
      :visible.sync="isShow"
      :title="title"
      custom-class="dh-question-mark-dialog"
      append-to-body
      width="554px"
      >
      <div class="dh-question-mark-message" v-html="message">
      </div>
      <template slot="footer">
        <button class="dh-button" @click="isShow = false">Ok, Got It!</button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import support from '../assets/support.svg'

export default {
  data() {
    return {
      isShow: false
    }
  },

  props: ['message', 'title'],

  components: {
    support
  }
}
</script>

<style lang="scss">
.dh-question-mark {
  display: inline-block;
  cursor: pointer;

  .dh-question-mark-icon svg{
    width: 13px;
    height: 13px;

    &:hover {
      color: $elementActiveColor;
    }
  }


}

.el-dialog.dh-question-mark-dialog {
  .dh-question-mark-message {
    text-align: center;
  }

  .el-dialog__footer {
    justify-content: flex-end;
  }
}
</style>