<template>
  <div class='arrow-born' @click="createPoint"><span>+</span></div>  
</template>
<script>
export default {
  props: ['elementId'],

  methods: {
    createPoint() {
      const { $store } = this;

      $store.commit('set', { path: 'newPoint', value: {}});
      $store.state.arrows.push({parent: this.elementId, child: 'toPoint' })
    }
  }
}
</script>
<style lang="scss">
  .arrow-born {
    color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 15px;
    width: 15px;
    font-size: 16px;
    border-radius: 7px;
    background-color: #fff;
    border: 1px solid #ddd;
    line-height: 10px;
    cursor: pointer;
  }
</style>
