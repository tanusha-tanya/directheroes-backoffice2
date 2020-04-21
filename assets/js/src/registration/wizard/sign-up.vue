<template>
  <div class="dh-sign-up-form">
    <div class="dh-sign-title">
       Create new account
    </div>
    <div class="dh-sign-form">
      <div class="dh-form-row">
        <dh-input label="E-mail" v-model="account.email" :error="errors.email" autocomplete="new-password" @input="clearError('email')"></dh-input>
      </div>
      <div class="dh-form-row">
        <dh-input label="First name" v-model="account.firstName" :error="errors.firstName" autocomplete="new-password" @input="clearError('firstName')"></dh-input>
        <dh-input label="Last name" v-model="account.lastName" :error="errors.lastName" autocomplete="new-password" @input="clearError('lastName')"></dh-input>
      </div>
      <div class="dh-form-row">
        <dh-input label="Password" type="password" v-model="account.password" autocomplete="new-password" :error="errors.password" @input="clearError('password')" @change="passwordValidation = account.password === confirmPassword"></dh-input>
        <dh-input label="Confirm password" type="password" v-model="confirmPassword" autocomplete="new-password" :error="errors.confirmPassword" @input="clearError('confirmPassword')" @change="passwordValidation = account.password === confirmPassword">
          <template v-slot:suffix v-if="passwordValidation">
            <success />
          </template>
        </dh-input>
      </div>
      <div class="dh-privacy-block">
        <dh-checkbox v-model="confirmPolicy"></dh-checkbox>
        <span>I have read and agree to the <a href="https://www.directheroes.com/privacy/" target="_blank">Policy</a> and <a href="https://www.directheroes.com/terms-and-conditions/" target="_blank">Terms of Service</a></span>
      </div>
      <el-tooltip
        popper-class="dh-global-error"
        :value="Boolean(globalError)"
        placement="top"
        :content="globalError"
        :manual="true">
        <dh-button @click="createAccount" :loading="creating" :disabled="!confirmPolicy">submit</dh-button>
      </el-tooltip>
    </div>
    <div class="dh-sign-in-form">
      Already have an account? — <a href="/login">Log in</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import success from '../../assets/success.svg'
import wizardStep from '../../mixins/wizard/wizard-step'

export default {
  data() {
    return {
      errors: {},
      account: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
      },
      confirmPassword: '',
      confirmPolicy: false,
      passwordValidation: false,
      globalError: '',
      creating: false
    }
  },

  components: {
    success
  },

  mixins: [wizardStep],

  methods: {
    clearError(property) {
      const { errors } = this;

      Vue.set(errors, property, null);
    },

    hasErrors() {
      const { account, confirmPassword, errors, confirmPolicy, passwordValidation } = this;
      const emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const emptyFilledError = 'Please fill in this field';

      if (!confirmPassword) {
        Vue.set(errors, 'confirmPassword', emptyFilledError)
      }

      Object.keys(account).forEach(accountProperty => {
        if (!account[accountProperty]) {
          Vue.set(errors, accountProperty, emptyFilledError);
          return;
        }

        switch (accountProperty) {
          case 'email':
            if (!emailReg.test(account.email)) {
              errors.email = 'Entered incorrect email'
            }
            break;
          case 'password':
            if (!passwordValidation) {
              errors.password = 'Passwords don\'t match'
            }
            break;
        }
      })

      return this.globalError || Object.keys(errors).some(error => errors[error]);
    },

    createAccount() {
      const { account, confirmPassword, errors, hasErrors, wizard } = this;

      this.globalError = null;

      if (hasErrors()) return

      this.creating = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/signup/create-account`,
        method: 'post',
        data: account
      }).then(({ data }) => {
        const { dhAccount, success, error } = data.response.body;

        if (!success) {
          if (error === 'account_exists') {
            Vue.set(errors, 'email', 'Account with this email address already exists. Please <a href="/login">login</a> or <a href="/resetting/request">recover your password</a>')
          }

          return;
        }

        dh.userName = dhAccount.username;

        wizard.setWizardState(null, 'billing', { dhAccount });
      }).catch((error) => {
        this.globalError = 'Server connection problem, please try again';
      }).finally(() => {
        this.creating = false;
      });
    },
  },
}
</script>

<style lang="scss">
.dh-sign-up-form {
  .dh-sign-form {
    padding: 23px 60px 28px;
    min-width: 440px;

    .dh-button {
      width: 100%;
      margin-top: 25px;
    }

    .el-input__suffix {
      color: #6DD230;
    }
  }

  .dh-form-row {
    display: flex;
  }

  .dh-input-wrapper {
    width: 100%;

    & + .dh-input-wrapper {
      margin-left: 28px;
    }
  }

  .dh-privacy-block {
    display: flex;
    align-items: center;
    margin-top: 3px;

    .dh-checkbox {
      margin-right: 10px;
    }
  }

  .dh-sign-in-form {
    padding: 28px 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #E8ECEF;

    a {
      margin-left: 3px;
    }
  }

  @include  screen-xs {
    .dh-sign-form {
      padding: 0;
      margin-top: 20px;
      width: 100%;
      min-width: auto;
    }

    .dh-form-row {
      flex-direction: column;
    }

    .dh-input-wrapper {
      & + .dh-input-wrapper {
        margin-left: 0;
      }
    }

    .dh-privacy-block {
      align-items: flex-start;
      margin-right: 20px;
    }

    .dh-sign-in-form {
      margin: 21px -16px 0;
      padding: 20px 0;
    }
  }
}

div.el-tooltip__popper.dh-global-error {
  background-color: $failColor;
  padding: 10px 30px;
  max-width: 300px;

  &[x-placement^=bottom] .popper__arrow {
    border-bottom-color: $failColor;

    &:after {
      border-bottom-color: $failColor;
    }
  }

  &[x-placement^=top] .popper__arrow {
    border-top-color: $failColor;

    &:after {
      border-top-color: $failColor;
    }
  }

  &[x-placement^=left] .popper__arrow {
    border-left-color: $failColor;
    top: calc(50% - 6px) !important;

    &:after {
      border-left-color: $failColor;
    }
  }
}
</style>