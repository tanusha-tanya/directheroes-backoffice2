<template>
  <div class="manual-element">
    <el-input
      placeholder="Please input type (default: sendTextAction)"
      v-model="elementType"
    >
    </el-input>
    <el-input
      type="textarea"
      placeholder="Input JSON"
      :autosize="{ minRows: 5, maxRows: 10}"
      v-model="elementValue"
    >
    </el-input>
    <span class="error" v-if="error">JSON not saved: {{error.message}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error: null,
    }
  },

  props:['element'],

  computed: {
    elementType: {
      get() {
        return this.element.type
      },
      set(value) {
        this.element.type = value || 'sendTextAction'
      }
    },

    elementValue: {
      get() {
        return JSON.stringify(this.element.value, null, 2)
      },
      set(value) {
        this.error = null;

        try {
          this.element.value = JSON.parse(value || '{ text: Enter-JSON }')
        } catch(error) {
          this.error=error;
        }
      }
    }
  }
}
</script>
<style lang="scss">
.manual-element {
  padding: 9px 20px 13px;

  .el-textarea {
    margin: 10px 0;
    .el-textarea__inner {
      resize: none;
      font-family: 'AbeatbyKai';
      font-size: 15px;

      &:focus {
        border-color: #c0c4cc;
      }
    }
  }

  .error {
    color: #f44336;
  }
}
</style>
