<template>
  <div class="input-autosize">
    <div class="input-buffer" v-html="value" ref="buffer"></div>
    <input type="text" :value="value" :style="{width}" @input="inputChange" ref="input">
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 0
    }
  },

  computed: {
    isNumbers() {
      const { onlyNumbers } = this;

      return typeof onlyNumbers !== 'undefined'
    }
  },

  props: ['value', 'onlyNumbers'],

  methods: {
    inputChange(event) {
      const value = this.isNumbers ? event.target.value.replace(/[^0-9]/g,'') : event.target.value;

      this.$emit('input', value);
    },

    setWidth() {
      const { buffer } = this.$refs;

      if (!buffer) return;

      this.$nextTick(() => {
        this.width = `${buffer.clientWidth}px`;
      });
    },
  },

  mounted() {
    this.setWidth();
  },

  watch: {
    value() {
      this.setWidth();
    },
  }
}
</script>

<style lang="scss">
  .input-autosize {
    display: inline-block;
    position: relative;
    font-size: 11px;

    &:hover {
      input {
        background-color: #B5C7F5;
      }
    }

    input, .input-buffer {
      font-size: inherit;
      letter-spacing: inherit;
      // min-width: 10px;
    }

    input {
      background-color: transparent;
      border: none;
      border-radius: 0;
      padding: 0;

      &:focus {
        background-color: #B5C7F5;
      }
    }

    .input-buffer {
      position: absolute;
      z-index: -1;
      pointer-events: none;
      white-space: nowrap;
      padding-right: 3px;
    }
  }
</style>