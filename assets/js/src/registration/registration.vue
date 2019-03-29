<template>
  <div id="app">
    <div class="container">
      <div class="header">
        <div class="logo"></div>
      </div>
      <stripe-payment goal="createPlanSubscription"></stripe-payment>
    </div>
  </div>
</template>

<script>
import stripePayment from '../component/stripePayment.vue'
export default {
  components: {
    stripePayment
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

@keyframes preloader-wave {
  0% {
      opacity: 1;
      background-color: #742BF9;
      transform: scale(0, 0);
  }
  100% {
      opacity: 0;
      background-color: #6A12CB;
      transform: scale(1, 1);
  }
}

body {
  margin: 0;
}

#app {
  padding: 20px 0;
  min-height: 100vh;
  background: linear-gradient(230.73deg, rgba(34, 106, 247, 0.85) 5.64%, rgba(98, 45, 206, 0.85) 58.18%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pre-loader {
  height: 50px;
  width: 50px;
  position: relative;
  margin: 0 auto;

  &:before, &:after {
    animation: 1.6s linear 0s normal none infinite running preloader-wave;
    background: none repeat scroll 0 0;
    border-radius: 100%;
    content: "";
    height: 50px;
    position: absolute;
    width: 50px;
    margin-left: -25px;
  }

  &:after {
    animation-delay: -0.8s;
  }
}

.loading-content {
  padding: 40px;
  text-align: center;
}

.container {
  background-color: #fff;
  width: 800px;
  box-shadow: 1px 2px 12px rgba(15, 31, 112, 0.7);
  border-radius: 5px;

  .header {
    border-bottom: 1px solid #D0D0D0;

    .logo {
      background-image: url(~/src/assets/logo.png);
      height: 77px;
      width: 266px;
    }
  }
}
</style>
