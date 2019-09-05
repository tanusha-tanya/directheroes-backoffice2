<template>
  <div class="dh-header">
    <div class="dh-menu-toggler">
      <menuToggler />
    </div>
    <div class="dh-header-title" v-if="title">
      {{title}}
    </div>
    <div class="dh-header-content">
      <slot></slot>
    </div>
    <div class="dh-header-notifications">
      <bell />
    </div>
    <div class="dh-header-settings">
      <gear />
    </div>
    <div class="dh-header-account">
      <div class="dh-header-account-userpic" :style="{'background-image': `url(${ userPic })`}"></div>
    </div>
  </div>
</template>

<script>
import menuToggler from '../assets/menu.svg'
import bell from '../assets/bell.svg'
import gear from '../assets/gear.svg'
import userPic from '../assets/user.png'

export default {
  data() {
    return {
      userPic
    }
  },

  components: {
    menuToggler,
    bell,
    gear
  },

  props: ['title']
}
</script>

<style lang="scss">
.dh-header {
  height: 64px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: $sectionBG;
  border-bottom: 1px solid $borderColor;
  padding: 0 28px;

  .dh-menu-toggler {
    color: $elementsColor;
    margin-right: 29px;
  }

  .dh-header-title {
    font-size: 20px;
    line-height: 24px;
  }

  .dh-header-content {
    flex-grow: 1;
  }

  .dh-header-notifications {
    color: $elementsColor;
    margin-right: 27px;
  }

  .dh-header-settings {
    color: $elementsColor;
    margin-right: 27px;
  }

  .dh-header-account-userpic {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-position: center;
    background-size: contain;
  }
}
</style>