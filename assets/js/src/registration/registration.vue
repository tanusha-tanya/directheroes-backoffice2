<template>
  <div id="app">
    <div class="form-container">
      <div class="header">
        <div class="logo"></div>
      </div>
      <div class="account-info">
        <div class="title">
          Direct Heroes Account Information
        </div>
        <div class="form-row">
          <label>
            First name
            <input v-model="registerInfo.firstName" autocomplete="off">
          </label>
          <label>
            Last name
            <input v-model="registerInfo.lastName" autocomplete="off">
          </label>
        </div>
        <div class="form-row">
          <label>
            E-mail
            <input v-model="registerInfo.email" @input="clearError('email')" autocomplete="off">
            <div class="error">{{errors.email}}</div>
          </label>
        </div>
        <div class="form-row">
          <label>
            Password
            <input v-model="registerInfo.password" type="password" @input="clearError('password')" autocomplete="off">
            <div class="error">{{errors.password}}</div>
          </label>
          <label>
            Repeat password
            <input v-model="repassword" type="password" @input="clearError('password')" autocomplete="off">
          </label>
        </div>
      </div>
      <div class="title">
        Payment Information
      </div>
      <stripe-payment goal="createPlanSubscription" ref="stripePayment">
        <template slot="footer" slot-scope="{submitPayment, canSendInfo, authorizeAmount}">
          <div class="confirm-button">
            <button :class="{loading: creating}" @click="createAccount(submitPayment, authorizeAmount)" :disabled="!canSendInfo || !allRegisterInfo || hasError || creating">
              Join right now
            </button>
          </div>
        </template>
      </stripe-payment>
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
      repassword: '',
      errors: {
        email: '',
        password: '',
        global: ''
      },
      creating: false,
    }
  },

  computed: {
    allRegisterInfo() {
      const { registerInfo, repassword } = this;

      return repassword && Object.keys(registerInfo).every(registerItem => registerInfo[registerItem]);
    },

    hasError() {
      const { errors } = this;

      return Object.keys(errors).some(error => errors[error]);
    }
  },

  components: {
    stripePayment
  },

  methods: {
    clearError(property) {
      const { errors } = this;

      switch (property) {
        case 'email':
          this.emailExist = false;
        break;
      }

      errors[property] = '';
    },

    createAccount(submitPayment, authorizeAmount) {
      const { stripePayment } = this.$refs;
      const { registerInfo, repassword, errors } = this;
      const emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (registerInfo.password !== repassword) {
        errors.password = 'Passwords don\'t match'
        return;
      }

      if (!emailReg.test(registerInfo.email)) {
        errors.email = 'Entered incorrect email'
        return
      }

      this.creating = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/signup/create-account`,
        method: 'post',
        data: registerInfo
      }).then(({ data }) => {
        const { dhAccount } = data.response.body

        dh.userName = dhAccount.username;

        stripePayment.initAddCard().then(() => {
          submitPayment(authorizeAmount * 100, (error) => {
            this.creating = false;

            if (error) return;

            window.location.href = 'https://www.launch.directheroes.com/thank-you';
          });
        }).catch((error) => {
          this.creating = false;
        });
      }).catch((error) => {
        this.creating = false;
      });
    }
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

@keyframes rotation {
  0% { transform:rotate(0deg); }
  100% { transform:rotate(360deg); }
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

.title {
  font-size: 20px;
  font-weight: bold;
  padding: 20px 20px 0;
}

.account-info {
  padding: 20px;
  border-bottom: 1px solid #D0D0D0;

  .title {
    padding: 0 0 20px;
  }
}

input, div.form-row label > div.StripeElement {
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

.form-container {
  background-color: #fff;
  width: 800px;
  box-shadow: 1px 2px 12px rgba(15, 31, 112, 0.7);
  border-radius: 5px;

  .header {
    border-bottom: 1px solid #D0D0D0;

    .logo {
      background-image: url(../assets/logo.png);
      height: 77px;
      width: 266px;
    }
  }
}

.stripe-payment {
  padding: 20px;
}

.StripeElement {
  padding-top: 13px !important;
  min-height: 43px !important;
}

.confirm-button {
  padding-top: 20px;
  margin: 15px -20px 0;
  text-align: center;
  border-top: 1px solid #D0D0D0;
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
      padding: 9px 15px;
    }
  }
}
</style>
