<template>
  <svg class="arrows" width="100%" height="100%">
    <template v-for="path in pathes" v-if="path && path.line">
      <path :d="path.line"  fill="none" stroke="#DDDDDD" stroke-width="2"></path>
      <path fill-rule="evenodd" :transform="`rotate(${path.arrow.angle}, ${path.arrow.x}, ${path.arrow.y}) translate(${path.arrow.x - 8}, ${path.arrow.y - 7})`" clip-rule="evenodd" d="M8 7L0 14L0 0L8 7Z" fill="#E7E7E7"/>
    </template>
    <!-- <circle cx="10" cy="10" r="5" fill="#FAFAFA" stroke="#DDDDDD" stroke-width="2"/>
    <circle cx="726" cy="180" r="5"          fill="#FAFAFA" stroke="#DDDDDD" />
    <path   d="M 726 180 C 276 87 270 10 0 0" fill="none" stroke="#DDDDDD"/> -->
  </svg>  
</template>
<script>

export default {
  data() {
    return {
      pathes: [],
    }
  },

  props: ['refs', 'arrows', 'scale'],
  
  methods: {
    recalcPathes() {
      setTimeout(() => {
        const { refs, getElement, scale } = this;
        const areaRect = this.$el.getBoundingClientRect();
       
        this.pathes = this.arrows.map(arrow => {
          const isToPoint = arrow.child == 'toPoint';
          let parent = getElement(arrow.parent);
          let child = isToPoint ? this.$store.state.newPoint : getElement(arrow.child);

          parent = parent[0] || parent;
          child = child[0] || child; 
          
          const startRect = (parent instanceof HTMLElement ? parent : parent.$el).getBoundingClientRect();
          const endRect = isToPoint ? child : (child instanceof HTMLElement ? child : child.$el).getBoundingClientRect();
          const isOnTop = startRect.top + startRect.height < endRect.top;
          const isOnBottom = startRect.top > endRect.top + endRect.height;
          const isOnRight = startRect.left + startRect.width < endRect.left;
          const isOnLeft = startRect.left > endRect.left + endRect.width

          if(!isOnTop && !isOnBottom && !isOnRight && !isOnLeft) return;

          const startX = ((((isOnTop || isOnBottom) && startRect.left + 0.5 * startRect.width) ||
            (isOnRight && startRect.left + startRect.width) ||
            (isOnLeft && startRect.left)) - areaRect.left) / scale

          const startY = (((isOnTop && startRect.top + startRect.height) || 
            (isOnBottom && startRect.top) ||
            ((isOnLeft || isOnRight) && startRect.top + 0.5 * startRect.height)) - areaRect.top) / scale

          const endX = ((((isOnTop || isOnBottom) && endRect.left + 0.5 * endRect.width) ||
            (isOnRight && endRect.left) ||
            (isOnLeft && endRect.left + endRect.width)) - areaRect.left) / scale

          const endY = (((isOnTop && endRect.top) || 
            (isOnBottom && endRect.top + endRect.height) ||
            ((isOnLeft || isOnRight) && endRect.top + 0.5 * endRect.height)) - areaRect.top) / scale
          
          const deltaX = (endX - startX) * .5
          const deltaY = (endY - startY) * .5
          
          let path = ((isOnTop || isOnBottom) && `M${ startX } ${ startY } Q${ startX } ${ startY + deltaY } ${ endX - deltaX } ${ endY - deltaY } T${ endX } ${ endY }`) || 
            ((isOnLeft || isOnRight) && `M${ startX } ${ startY } Q${ startX + deltaX } ${ startY } ${ endX - deltaX } ${ endY - deltaY } T${ endX } ${ endY }`)
        
          let angle = (isOnTop && 90) || (isOnBottom && 270) || (isOnLeft && 180) || 0;
          
          return {
            line: path, 
            arrow: {
              x: endX,
              y: endY,
              angle
            }
          }
        })
      }, 100)
    },

    getElement(id) {
      const findElement = container => {
        if (container.$refs.hasOwnProperty(id)) {
          element = container.$refs[id];
          return true
        }
        
        container.$children.find(child => findElement(child));
      }
      const { refs } = this;
      let element = null;

      findElement(refs);
      
      return element
    }
  },

  mounted() {
    this.recalcPathes()
  },

  watch: {
    '$store.state.newPoint'(newValue) {
      if (newValue) {
        this.recalcPathes()
      } else {
        const { arrows } = this.$store.state;

        arrows.splice(arrows.length - 1, 1);
        this.recalcPathes()
      }
    },

    '$store.state.arrowConnectData'(value) {
      if (value) return;

      this.recalcPathes()
    },
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
