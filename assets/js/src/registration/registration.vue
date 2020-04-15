<template>
  <div class="dh-sign-app">
    <div class="dh-sign-step" :class="[`dh-step-${ wizardState }`]">
      <div class="dh-logo"></div>
      <component
        :is="wizardState"
      ></component>
    </div>
  </div>
</template>

<script>
import wizardMixin from '../mixins/wizard/wizard'
import signUp from './wizard/sign-up'
import billing from './wizard/billing'
import thanks from './wizard/thanks'
import plans from './wizard/plans'

export default {
  data() {
    const code = /code=([^&]*)/.exec(location.search);
    const { defaultPlan, plans } = dh;
    const currentPlan = (code && code[1]) || defaultPlan;

    plans.forEach(element => element.parameters.sort((a,b) => b.priority - a.priority));

    return {
      selectedPlan: plans.find(plan => plan.code === currentPlan) || plans[0],
      dhAccount: null,
    }
  },

  mixins: [ wizardMixin ],

  components: {
    signUp,
    billing,
    thanks,
    plans
  },

  created() {
    const referrer = /ref=([^&]*)/.exec(location.search);
    const { setWizardState } = this;

    if (referrer && referrer[1]) {
      document.cookie = 'referrer=' + referrer[1] + '; path=/; max-age=2592000'
    }

    setWizardState(null, 'sign-up');
  },
}
</script>

<style lang="scss">
@import '../styles/fonts.scss';
@import '../styles/common.scss';

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  height: 100vh;
  background-color: $mainBGColor;
  font: normal 14px Rubik, sans-serif;
  color: $mainTextColor;
}

.dh-sign-app {
  min-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    text-decoration: none;
    color: $primary;
  }

  .dh-sign-step {
    background: #FFFFFF;
    box-shadow: 0px 2px 80px rgba(27, 30, 36, 0.05);
    border-radius: 4px;
    padding-top: 40px;
    position: relative;
    margin: 100px 0 25px;
  }

  .dh-sign-title {
    font-size: 30px;
    line-height: 36px;
    text-align: center;
    color: #000000;
  }

  .dh-logo {
    width: 200px;
    height: 36px;
    background-image: url(../assets/logo.png);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    margin: 0 auto;
    position: absolute;
    bottom: calc(100% + 40px);
    left: calc(50% - 100px);
  }
}
</style>