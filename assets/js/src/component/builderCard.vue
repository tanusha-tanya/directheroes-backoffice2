<template>
  <div class="builder-card">
    <div class="builder-card-header" >
      <span class="builder-card-drag-handler" @mousedown="mouseDown">
        <slot name="header"></slot>
      </span>
      <div :class="{ 'collapse-toggler':true, collapsed: isCollapsed }" @click="isCollapsed = !isCollapsed"></div>
    </div>
    <div class="builder-card-body" v-if="!isCollapsed">
      <slot name="body"></slot>
    </div>
  </div>
</template>
<script>
let startX, startY, initialMouseX, initialMouseY;

export default {
  data() {
    return {
      isCollapsed: false
    }
  },

  methods: {
    mouseDown(event) {
      const mouseMove = (event) => {
        const left = startX + (event.clientX - initialMouseX);
        const top = startY + (event.clientY - initialMouseY);
        this.$el.style.top = `${ top < 0 ? 0 : top }px`;
        this.$el.style.left = `${ left < 0 ? 0 : left }px`;
        return false;
      }

      const mouseUp = (event) => {
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

  mounted() {

  }
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
  padding: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  border-radius: 10px 10px 0 0;

  .collapse-toggler {
    width: 16px;
    height: 16px;
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

