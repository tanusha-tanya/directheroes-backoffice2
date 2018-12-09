<template>
  <div class='arrow-born' @click="createPoint"><span>+</span></div>  
</template>
<script>
import ObjectId from '../utils/ObjectId'
import Vue from 'vue'

export default {
  props: ['element'],

  methods: {
    createPoint() {
      const { $store } = this;

      $store.commit('set', { path: 'newPoint', value: {}});
      $store.state.arrows.push({parent: this.element.id, child: 'toPoint' })
    }
  },

  watch: {
    "$store.state.arrowConnectData"(value) {
      const { element } = this;

      if (!value || value.parent !== element.id) return
      
      Vue.set(element, 'onMatch', {
        type: 'goToStep',
        id: (new ObjectId).toString(),
        value: {
          stepId: value.child
        }
      })

      console.log(element);
      
      this.$store.commit('set', {path: 'arrowConnectData', value: null});
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
