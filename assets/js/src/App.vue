<template>
  <div id="app">
    <dh-header></dh-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './sections/header.vue'

export default {
  name: 'app',

  data () {
    return {

    }
  },
  components: {
    'dh-header': Header
  }
}
</script>

<style lang="scss">
#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: #F5F5F5;
  height: 100%;
  font-size: 12px;
  line-height: 16px;
}

.container {
  min-height: calc(100% - 50px);
  display: flex;
  color: #0C0033;
}

.sidebar {
  max-width: 250px;
  width: 100%;
  background-color: #EEEEEE;
}

.content {
  flex-grow: 1;
}

.el-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  vertical-align: middle;

  .el-switch__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
  }

  &.is-checked .el-switch__core {
    &:after {
      left: 100%;
      margin-left: -14px;
    }
  }

  .el-switch__core {
    margin: 0;
    display: inline-block;
    position: relative;
    width: 40px;
    height: 20px;
    border: 3px solid #85539C;
    outline: none;
    border-radius: 10px;
    cursor: pointer;
    vertical-align: middle;

    &:after {
      content: "";
      position: absolute;
      top: 1px;
      left: 2px;
      border-radius: 100%;
      transition: all .3s;
      width: 12px;
      height: 12px;
      background-color: #85539C;
    }
  }
}
</style>
