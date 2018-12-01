<template>
  <svg class="arrows" width="100%" height="100%">
    <path :d="path" v-for="path in pathes" fill="none" stroke="#DDDDDD" stroke-width="2px"></path>
    <!-- <circle cx="10" cy="10" r="5" fill="#FAFAFA" stroke="#DDDDDD" stroke-width="2"/>
    <circle cx="726" cy="180" r="5"          fill="#FAFAFA" stroke="#DDDDDD" />
    <path   d="M 726 180 C 276 87 270 10 0 0" fill="none" stroke="#DDDDDD"/> -->
  </svg>  
</template>
<script>
const config = {
  // elementDistance: 50,
};
const absolute = function(x) {
    return (x < 0) ? -x : x;
}
const signum = function(x) {
    return (x < 0) ? -1 : 1;
}

export default {
  data() {
    return {
      pathes: []
    }
  },

  props: ['refs', 'arrows'],
  
  methods: {
    recalcPathes() {
      const { refs } = this;
      const areaRect = this.$el.getBoundingClientRect();
      
      this.pathes = this.arrows.map(arrow => {
        const coords = {};
        let startX, startY, endX, endY, deltaX, deltaY, delta, arc1, arc2
        let startRect = refs[arrow.parent].$el.getBoundingClientRect();
        let endRect = refs[arrow.child][0].$el.getBoundingClientRect();
        let path = '';
        
        if (startRect.top + startRect.height < endRect.top) {
          startX = startRect.left + 0.5 * startRect.width - areaRect.left
          startY = startRect.top + startRect.height - areaRect.top

          endX = endRect.left + 0.5 * endRect.width - areaRect.left
          endY = endRect.top - areaRect.top

          deltaX = (endX - startX) * .5
          deltaY = (endY - startY) * .5

          path = `M${ startX } ${ startY } Q${ startX } ${ startY + deltaY } ${ endX - deltaX } ${ endY - deltaY } T${ endX } ${ endY }`
        } else if (startRect.top > endRect.top + endRect.height) {
          startX = startRect.left + 0.5 * startRect.width - areaRect.left
          startY = startRect.top - areaRect.top

          endX = endRect.left + 0.5 * endRect.width - areaRect.left
          endY = endRect.top + endRect.height - areaRect.top

          deltaX = (endX - startX) * .5
          deltaY = (endY - startY) * .5

          path = `M${ startX } ${ startY } Q${ startX } ${ startY + deltaY } ${ endX - deltaX } ${ endY - deltaY } T${ endX } ${ endY }`
        } else {
          if (startRect.left + startRect.width < endRect.left) {
            startX = startRect.left + startRect.width - areaRect.left
            startY = startRect.top + 0.5 * startRect.height - areaRect.top

            endX = endRect.left - areaRect.left
            endY = endRect.top + 0.5 * endRect.height - areaRect.top

            deltaX = (endX - startX) * .5
            deltaY = (endY - startY) * .5

            path = `M${ startX } ${ startY } Q${ startX + deltaX } ${ startY } ${ endX - deltaX } ${ endY - deltaY } T${ endX } ${ endY }`
          } else if (startRect.left > endRect.left + endRect.width) {
            startX = startRect.left - areaRect.left
            startY = startRect.top + 0.5 * startRect.height - areaRect.top

            endX = endRect.left + endRect.width - areaRect.left
            endY = endRect.top + 0.5 * endRect.height - areaRect.top

            deltaX = (endX - startX) * .5
            deltaY = (endY - startY) * .5

            path = `M${ startX } ${ startY } Q${ startX + deltaX } ${ startY } ${ endX - deltaX } ${ endY - deltaY } T${ endX } ${ endY }`
          }
        }
        
        return path
      })
    }
  },

  mounted() {
    this.recalcPathes()
  }
}
</script>
<style lang="scss">
  .arrows {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;
    pointer-events: none;
  }
</style>
