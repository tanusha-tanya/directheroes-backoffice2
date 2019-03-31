<template>
  <div id="app">
    <div class="container">
      <div class="header">
        <div class="logo"></div>
      </div>
      <div class="account-info">
        <div class="form-row">
          <label>
            First name
            <input v-model="registerInfo.firstName">
          </label>
          <label>
            Last name
            <input v-model="registerInfo.lastName">
          </label>
        </div>
        <div class="form-row">
          <label>
            E-mail
            <input v-model="registerInfo.email">
          </label>
        </div>
        <div class="form-row">
          <label>
            Password
            <input v-model="registerInfo.password" type="password">
          </label>
          <label>
            Repeat password
            <input v-model="repassword" type="password">
          </label>
        </div>
      </div>
      <stripe-payment goal="createPlanSubscription"></stripe-payment>
      <div class="confirm-button">
        <button @click="createAccount">
          Join right now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import stripePayment from '../component/stripePayment.vue'
export default {
  data() {
    return {
      registerInfo: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      repassword: ''
    }
  },

  components: {
    stripePayment
  },

  methods: {
    createAccount() {
      const { registerInfo } = this;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/signup/create-account`,
        method: 'post',
        data: registerInfo
      }).then(({ data }) => {
        console.log(data);

      })
    }
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
  font-family: sans-serif;
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

.account-info {
  padding: 20px;
  border-bottom: 1px solid #D0D0D0;
}

input {
  padding: 5px 15px;
  border: 1px solid #d0d0d0;
  border-radius: 50px;
  width: 100%;
  outline: none;
  font-size: 20px;

  &::placeholder {
    color: #d0d0d0;
    transition: .3s opacity;
  }
}

button {
  background: #6A12CB;
  border-radius: 100px;
  border: none;
  color: #fff;
  font-size: 24px;
  padding: 10px 20px;
  // width: 100%;
  // margin-top: 30px;
  outline: none;

  &:disabled {
    opacity: .5;
    cursor: default;
  }

  &.loading {
    color: transparent;
    position: relative;

    &:before {
      content: '';
      display: block;
      position: absolute;
      top: calc(50% - 10px);
      left: calc(50% - 10px);
      width: 15px;
      height: 15px;
      border-radius: 100%;
      border: 3px solid #FFF;
      border-bottom-color: transparent;
      animation: rotation  .8s infinite linear;
    }
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

.stripe-payment {
  border-bottom: 1px solid #D0D0D0;
}

.confirm-button {
  padding: 20px;
  text-align: center;
}

.form-row {
  display: flex;
  margin: 0 -10px 10px;

  label {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 10px;

    & > div:not(.error) {
      border: 1px solid #dddddd;
      border-radius: 8px;
      padding: 10px;
      font-size: 15px;
      min-height: 37px;
    }

    input {
      padding: 9px;
    }
  }
}
</style>
