<template>
  <svg class="arrows" width="100%" height="100%">
    <path :d="path" v-for="path in pathes" fill="none" stroke="#DDDDDD" stroke-width="2px"></path>
    <!-- <circle cx="10" cy="10" r="5" fill="#FAFAFA" stroke="#DDDDDD" stroke-width="2"/>
    <circle cx="726" cy="180" r="5"          fill="#FAFAFA" stroke="#DDDDDD" />
    <path   d="M 726 180 C 276 87 270 10 0 0" fill="none" stroke="#DDDDDD"/> -->
  </svg>  
</template>
<script>
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
        let startRect = refs[arrow.parent].$el.getBoundingClientRect();
        let endRect = refs[arrow.child][0].$el.getBoundingClientRect();
        const coords = {};

        coords.start = {
          x: startRect.left + 0.5 * startRect.width - areaRect.left,
          y: startRect.top + startRect.height - areaRect.top
        }

        coords.end = {
          x: endRect.left + 0.5 * endRect.width - areaRect.left,
          y: endRect.top - areaRect.top
        }

        coords.deltaData= { 
          x: (coords.end.x - coords.start.x) * 0.15,
          y: (coords.end.y - coords.start.y) * 0.15,
        }

        coords.delta = coords.deltaData.y < absolute(coords.deltaData.x) ? coords.deltaData.y : absolute(coords.deltaData.x)

        coords.arc1 = 0;
        coords.arc2 = 1;

        if (coords.start.x > coords.end.x) {
          coords.arc1 = 1;
          coords.arc2 = 0;
        }
        
        return `M${ coords.start.x } ${ coords.start.y }` +
               ` V${ coords.start.y + coords.delta }` +
               ` A${ coords.delta } ${ coords.delta} 0 0 ${ coords.arc1 } ${ coords.start.x + coords.delta * signum(coords.deltaData.x) } ${ coords.start.y + 2 * coords.delta }` +
               ` H${ coords.end.x - coords.delta * signum(coords.deltaData.x) }` +
               ` A${ coords.delta } ${ coords.delta} 0 0 ${ coords.arc2 } ${ coords.end.x } ${ coords.start.y + 3 * coords.delta }` +
               ` V${ coords.end.y }`
      
      // path.attr("d",  "M"  + startX + " " + startY +
      //           " V" + (startY + delta) +
      //           " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (startY + 2*delta) +
      //           " H" + (endX - delta*signum(deltaX)) + 
      //           " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
      //           " V" + endY );
      
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
