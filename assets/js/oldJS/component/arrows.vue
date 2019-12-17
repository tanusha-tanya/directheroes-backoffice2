<template>
  <svg class="arrows" width="100%" height="100%">
    <template v-for="path in pathes" v-if="path && path.line">
      <circle :cx="path.begin.x" :cy="path.begin.y" r="4" stroke-width="2" fill="#fff" :stroke="path.color"/>
      <path :d="path.line"  fill="none" :stroke="path.color" :stroke-dasharray="path.arrowInfo.isExisting && '10 5'" :style="{'stroke-width': path.arrowInfo.hover ? 3 : 1}"></path>
      <path fill-rule="evenodd" :transform="`rotate(${path.arrow.angle}, ${path.arrow.x}, ${path.arrow.y}) translate(${path.arrow.x - 12}, ${path.arrow.y - 7})`" clip-rule="evenodd" d="M8 7L0 14L0 0L8 7Z" :fill="path.color"/>
      <circle :cx="path.arrow.x" :cy="path.arrow.y" r="4" stroke-width="2" fill="#fff" :stroke="path.color"/>
    </template>
  </svg>
</template>
<script>
import debounce from 'lodash/debounce'

export default {
  data() {
    return {
      pathes: [],
    }
  },

  props: ['refs', 'arrows', 'scale'],

  methods: {
    recalcPathes() {
      const { refs, getElement, scale } = this;
      const areaRect = this.$el.getBoundingClientRect();

      this.pathes = this.arrows.map(arrow => {
        const isToPoint = arrow.child == 'toPoint';
        let color = '#B2B2B2';
        let parent = getElement(arrow.parent);
        let child = getElement(arrow.child);

        if (!parent || !child) return;

        parent = parent[0] || parent;
        child = child[0] || child;

        const firstElement = child.step.elements[0];

        switch((firstElement.displaySettings && firstElement.displaySettings.subType) || firstElement.type) {
          case 'message':
            color = '#B2B2B2'
          break;
          case 'action':
            color = '#F4B109'
          break;
          case 'trigger':
            color = '#5CA6A6'
          break;
          case 'condition':
            color = '#FF9B71'
          break;
          case 'user-input':
            color = '#717FFF'
          case 'sub-input':
            color = '#717FFF'
          break;
        }

        const startRect = (parent instanceof HTMLElement ? parent : parent.$el).getBoundingClientRect();
        const endRect = isToPoint ? child : (child instanceof HTMLElement ? child : child.$el).querySelector('.step-item-header').getBoundingClientRect();
        const isOnTop = startRect.top + startRect.height < endRect.top;
        const isOnBottom = startRect.top > endRect.top + endRect.height;
        const isOnRight = startRect.left + startRect.width < endRect.left + endRect.width;
        const isOnLeft = startRect.left > endRect.left;
        const isOnLeftFull = startRect.left > endRect.left + endRect.width;
        const isOnRightFull = startRect.left + startRect.width < endRect.left;

        if(!isOnTop && !isOnBottom && !isOnRightFull && !isOnLeftFull) return;

        const startX = (((isOnLeft && startRect.left) || startRect.left + startRect.width) - areaRect.left) / scale

        const startY =  ((startRect.top + 0.5 * startRect.height - 3) - areaRect.top) / scale

        const endX = (((((isOnLeft && !isOnLeftFull) || isOnRightFull) && endRect.left) || (endRect.left + endRect.width)) - areaRect.left) / scale

        const endY = (((endRect.top + 0.5 * endRect.height)) - areaRect.top) / scale

        const deltaX = (endX - startX) * .5
        const deltaY = (endY - startY) * .5

        let path = `M${ startX + 4 } ${ startY } `

        if (!isOnLeftFull && !isOnRightFull) {
          path += `Q${ endX + deltaX } ${ startY } ${ endX + deltaX } ${ endY - deltaY }`
        } else {
          path += `Q${ startX + deltaX } ${ startY } ${ endX - deltaX } ${ endY - deltaY }`
        }

        path += `T${ endX } ${ endY }`

        let angle = (((isOnRight && !isOnLeft && !isOnRightFull) || isOnLeftFull ) && 180) || 0;

        return {
          line: path || '',
          begin: {
            x: startX,
            y: startY,
          },
          arrow: {
            x: endX,
            y: endY,
            angle
          },
          color,

          arrowInfo: arrow,
        }
      })
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
    setTimeout(() => {
      this.recalcPathes()
    }, 10)
  },

  // watch: {
  //   '$store.state.newPoint'(newValue) {

  //     if (newValue) {
  //       this.recalcPathes()
  //     } else {
  //       const { arrows } = this.$store.state;
  //       const connectArrow = arrows.find(arrow => arrow.child === 'toPoint')

  //       if (connectArrow) {
  //         arrows.splice(arrows.indexOf(connectArrow), 1);
  //       }

  //       this.recalcPathes()
  //     }
  //   },

  //   '$store.state.arrowConnectData'(value) {
  //     if (value) return;

  //     this.recalcPathes()
  //   },
  // }
}
</script>
<style lang="scss">
  .arrows {
    position: absolute;
    height: 100%;
    left: 0;
    right: 0;
    z-index: 1;
    pointer-events: none;
  }
</style>
