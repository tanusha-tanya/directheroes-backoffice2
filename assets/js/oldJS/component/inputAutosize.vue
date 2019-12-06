<template>
  <div class="input-autosize">
    <div class="input-buffer" v-html="currentValue" ref="buffer"></div>
    <input :type="isNumbers ? 'number': 'text'" :value="currentValue" :style="{width}" @input="inputChange" ref="input">
  </div>
</template>

<script>
export default {
  data() {
    const { value } = this;
    return {
      width: 0,
      currentValue: value
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
      const value = this.isNumbers ? parseFloat(event.target.value.replace(/[^0-9]/g,'')) : event.target.value;

      this.currentValue = value;

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
    currentValue() {
      this.setWidth();
    },

    value(value) {
      this.currentValue = value;
    }
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

      &[type=number] {
        &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
          appearance: none;
          margin: 0;
        }
      }

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