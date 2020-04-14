<template>
  <div class="dh-sign-app">
    <div class="dh-sign-step">
      <component
        :is="wizardState"
      ></component>
    </div>
  </div>
</template>

<script>
import wizardMixin from '../mixins/wizard/wizard'
import signUp from './wizard/sign-up'

export default {
  mixins: [ wizardMixin ],

  components: {
    signUp
  },

  created() {
    const { setWizardState } = this;

    setWizardState(null, 'signUp')
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
  height: 100vh;
  background-color: $mainBGColor;
  font: normal 14px Rubik, sans-serif;
  color: $mainTextColor;
}

.dh-sign-app {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .dh-sign-step {
    background: #FFFFFF;
    box-shadow: 0px 2px 80px rgba(27, 30, 36, 0.05);
    border-radius: 4px;
    padding-top: 40px;
  }

  .dh-sign-title {
    font-size: 30px;
    line-height: 36px;
    color: #000000;
  }
}
</style>