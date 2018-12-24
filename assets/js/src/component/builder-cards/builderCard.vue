<template>
  <div class="builder-card" :style="{ top: `${ settings.positionY }px`, left: `${ settings.positionX }px`}">
    <div class="builder-card-header" >
      <span class="builder-card-drag-handler" @mousedown="mouseDown">
        <slot name="header"></slot>
      </span>
      <slot name="header-controls"></slot>
      <div :class="{ 'collapse-toggler':true, collapsed: settings.collapsed }" @click="settings.collapsed  = !settings.collapsed "></div>
    </div>
    <div class="builder-card-body" v-if="!settings.collapsed">
      <slot name="body"></slot>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import EventBus from '../../utils/event-bus.js'

let startX, startY, initialMouseX, initialMouseY;

export default {
  methods: {
    mouseDown(event) {
      const { settings } = this;
      const startingPos = {};
      startingPos['x'] = settings.positionX;
      startingPos['y'] = settings.positionY;
      this.$emit('mousedown', startingPos)
      console.log('mouse down event', startingPos)
      // EventBus.$emit('builderCard:mousedown', (startingPos));

      const mouseMove = (event) => {
        const left = startX + (event.clientX - initialMouseX);
        const top = startY+ (event.clientY - initialMouseY);
        Vue.set(settings, 'positionY', top < 0 ? 0 : top);
        Vue.set(settings, 'positionX', left < 0 ? 0 : left);
        return false;
      }

      const mouseUp = (event) => {
        this.$emit('mouseup', this.settings)
        // EventBus.$emit('builderCard:mouseup', this.settings);
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      }

      startX = this.$el.offsetLeft;
      startY = this.$el.offsetTop;
      initialMouseX = event.clientX;
      initialMouseY = event.clientY;
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
      return false;
    },
  },

  props: ['settings']
};
</script>
<style lang="scss">
.builder-card {
  border-radius: 10px;
  width: 328px;
  position: absolute;
  user-select: none;
  background-color: #000;
  z-index: 1;
}

.builder-card-header {
  font-size: 15px;
  color: #fff;
  display: flex;
  align-items: center;
  border-radius: 10px 10px 0 0;

  .collapse-toggler {
    width: 16px;
    height: 16px;
    margin: 10px;
    position: relative;
    flex-shrink: 0;

    &:before {
      content: '';
      position: absolute;
      top: 7px;
      bottom: 7px;
      left: 1px;
      right: 1px;
      background-color: #fff
    }

    &.collapsed:after {
      content: '';
      position: absolute;
      top: 1px;
      bottom: 1px;
      left: 7px;
      right: 7px;
      background-color: #fff
    }
  }
}

.builder-card-drag-handler {
  flex-grow: 1;
  cursor: move;
  min-height: 15px;
  padding: 10px;
}

.builder-card-body {
  font-size: 15px;
  padding: 10px;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
  border: 2px solid;
  border-top-width: 0;
}
</style>

