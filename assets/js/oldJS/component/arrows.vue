<template>
  <svg class="arrows" width="100%" height="100%">
    <defs>
      <symbol id="arrow-delete" width="20" height="20">
        <text x="10" y="10" text-anchor="middle" font-size="20px" font-family="Arial" dy=".3em" fill="currenColor">&times</text>
      </symbol>
    </defs>
    <template v-for="path in pathes" v-if="path && path.line">
      <g class="arrow-group" :fill="path.color" :style="{color: path.color}" @mouseover="$emit('mid-step-button', path)">
        <path class="arrow-path" :d="path.line"  fill="none" :stroke="path.color" :stroke-dasharray="path.arrowInfo.isExisting && '10 5'" :style="{'stroke-width': path.arrowInfo.hover ? 3 : 1}"></path>
        <path fill-rule="evenodd" :transform="`rotate(${path.arrow.angle}, ${path.arrow.x}, ${path.arrow.y}) translate(${path.arrow.x - 12}, ${path.arrow.y - 7})`" clip-rule="evenodd" d="M8 7L0 14L0 0L8 7Z" :fill="path.color"/>

        <circle :cx="path.begin.x" :cy="path.begin.y" r="4" stroke-width="2" fill="#fff" :stroke="path.color" @click="$emit('remove-link', path)"/>
        <use class="arrow-times" :x="path.begin.x - 10" :y="path.begin.y - 10" xlink:href = "#arrow-delete"/>

        <circle :cx="path.arrow.x" :cy="path.arrow.y" r="4" stroke-width="2" fill="#fff" :stroke="path.color" @click="$emit('remove-link', path)"/>
        <use class="arrow-times" :x="path.arrow.x - 10" :y="path.arrow.y - 10" xlink:href = "#arrow-delete"/>
      </g>
    </template>
  </svg>
</template>
<script>

export default {
  data() {
    return {
      pathes: [],
      showMidStepButton: false,
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

        if (!parent || !child || !child.length) return;

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
    },

    initAddMidStep(path) {
      console.log(path);
    }
  },

  mounted() {
    setTimeout(() => {
      this.recalcPathes()
    }, 10)
  },

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

    .arrow-group {
      pointer-events: all;

      &:hover {
        .arrow-path {
          stroke-width: 3 !important;
        }

        circle {
          r: 15 !important;
          z-index: 2;
          cursor: pointer;
        }

        .arrow-times {
          opacity: 1;
        }
      }
    }

    .arrow-times {
      opacity: 0;
      cursor: pointer;
      pointer-events: none;
    }
  }
</style>
