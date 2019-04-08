<template>
  <div class='arrow-born' @click="createPoint"><span>+</span></div>
</template>
<script>
import Vue from 'vue'

export default {
  props: ['element'],

  methods: {
    createPoint() {
      const { $store, element } = this;

      $store.commit('set', { path: 'newPoint', value: {}});
      $store.state.arrows.push({parent: this.element.id, child: 'toPoint' })
    }
  },

  watch: {
    "$store.state.arrowConnectData"(value) {
      const { element } = this;

      if (!value || value.parent !== element.id) return

      this.$emit('connect-arrow', value)
    }
  }
}
</script>
<style lang="scss">
  .arrow-born {
    color: #fff;
    text-align: center;
    height: 15px;
    width: 15px;
    font-size: 16px;
    border-radius: 7px;
    background-color: #2e9d7b;
    border: 1px solid #2e9d7b;
    cursor: pointer;
    line-height: 15px;
  }
</style>
