<template>
  <div class="dh-stripe" >
    <div class="dh-owner-info" v-show="stripe">
      <div class="dh-owner-row">
        <dh-input label="Full name" v-model="owner.name" :error="errors.name" @input="clearError('name')"></dh-input>
      </div>
      <div class="dh-owner-row">
        <dh-input label="Address" v-model="owner.address.line1" :error="errors.line1" @input="clearError('line1')"></dh-input>
        <dh-input label="Country" v-model="owner.address.country" :error="errors.country" @input="clearError('country')"></dh-input>
      </div>
      <div class="dh-owner-row">
        <dh-input label="City" v-model="owner.address.city" :error="errors.city" @input="clearError('city')"></dh-input>
        <dh-input label="State/Province" v-model="owner.address.state" :error="errors.state" @input="clearError('state')"></dh-input>
        <dh-input label="ZIP" v-model="owner.address.postal_code" :error="errors.postal_code" @input="clearError('postal_code')"></dh-input>
      </div>
    </div>
    <div class="dh-card-info" v-show="stripe">
      <el-tooltip
        popper-class="dh-card-error"
        :value="Boolean(errors.card)"
        placement="left-start"
        :content="errors.card"
        :manual="true">
        <div class="dh-card-wrapper" :class="{'dh-card-wrapper-error': Boolean(errors.card)}">
          <div class="dh-card">
            <label class="dh-input-wrapper">
              <span class="dh-input__header">Card number</span>
              <div class="dh-card-input dh-card-number">
                <dh-card-brand-image :type="cardBrand"></dh-card-brand-image>
                <div id="card-number"></div>
              </div>
              <div class="dh-input__footer dh-input-error"></div>
            </label>
            <div class="dh-card-row">
              <label class="dh-input-wrapper">
                <span class="dh-input__header">Expire date</span>
                <div class="dh-card-input dh-card-expiry">
                  <div id="card-expiry"></div>
                </div>
                <div class="dh-input__footer dh-input-error"></div>
              </label>
              <label class="dh-input-wrapper">
                <span class="dh-input__header">CVV code</span>
                <div class="dh-card-input dh-card-cvc">
                  <div id="card-cvc"></div>
                </div>
                <div class="dh-input__footer dh-input-error"></div>
              </label>
            </div>
          </div>
        </div>
      </el-tooltip>
      <slot></slot>
    </div>
    <loader v-if="!stripe"/>
  </div>

</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import loader from './dh-loader'
import dhCardBrandImage from './dh-card-brand-image'

export default {
  data() {
    return {
      stripe: null,
      publicKey: null,
      authorizeAmount: null,
      clientSecret: null,
      cardInfoComplete: false,
      errors: {},
      globalError: null,
      cardNumber: null,
      cardCvc: null,
      cardExpiry: null,
      cardBrand: null,
      owner: {
        name: '',
        address: {
          line1: '',
          city: '',
          postal_code: '',
          country: '',
          state: ''
        }
      },
    }
  },

  props: ['goal', 'returnUrl', 'planCode'],

  components: {
    dhCardBrandImage,
    loader,
  },

  methods: {
    initAddCard() {
      const { goal, returnUrl } = this;
      const request = axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/init-add-card`,
        params: { goal, return_url: encodeURIComponent(returnUrl) }
      })

      request.then(({ data }) => {
        const { stripePk, previousSourceOwner, paymentIntent, sessionId } = data.response.body;

        this.publicKey = stripePk;
        this.sessionId = sessionId;
        this.clientSecret = paymentIntent.clientSecret;

        if (!previousSourceOwner) return;

        Object.assign(this.owner, previousSourceOwner);

        this.owner.address = this.owner.address || {};
      });

      return request;
    },

    stripeElementsInit() {
      const { errorHandler, publicKey } = this;
      const stripe = Stripe(publicKey, {
        betas: ['payment_intent_beta_3']
      });
      const elements = stripe.elements();
      const cardNumber = elements.create("cardNumber");
      const cardExpiry = elements.create("cardExpiry");
      const cardCvc = elements.create("cardCvc");

      cardNumber.mount("#card-number");
      cardExpiry.mount("#card-expiry");
      cardCvc.mount("#card-cvc");

      cardNumber.on("change", errorHandler);
      cardExpiry.on("change", errorHandler);
      cardCvc.on("change", errorHandler);

      cardNumber.on("change", errorHandler);
      cardExpiry.on("change", errorHandler);
      cardCvc.on("change", errorHandler);

      this.stripe = stripe;
      this.cardNumber = cardNumber;
      this.cardExpiry = cardExpiry;
      this.cardCvc = cardCvc;
    },

    errorHandler(event) {
      const { errors } = this;
      const { error, elementType } = event;

      if (elementType === 'cardNumber') {
        this.cardBrand = event.brand;
      }

      Vue.set(errors, 'card', error && error.message);
    },

    hasErrors() {
      const { cardNumber, cardExpiry, cardCvc, owner, errors } = this;
      const { address } = owner;
      const emptyFilledError = 'Please fill out this field';

      if (!owner.name) {
        Vue.set(errors, 'name', emptyFilledError)
      }

      Object.keys(address).forEach(addressProperty => {
        if (addressProperty === 'line2' || address[addressProperty]) return;

        Vue.set(errors, addressProperty, emptyFilledError)
      })

      if (!cardNumber._complete || !cardExpiry._complete || !cardCvc._complete) {
        Vue.set(errors, 'card', 'Please fill out card fields')
      }

      return Object.keys(errors).some(error => errors[error]);
    },

    submitPayment(callback) {
      const {
        sessionId,
        stripe,
        errors,
        cardNumber,
        owner,
        clientSecret,
        setPaymentSource,
        hasErrors,
      } = this;

      if (hasErrors()) {
        callback(true);

        return
      };

      stripe.handleCardPayment(clientSecret, cardNumber, {
        source_data: {
          owner
        },
        save_payment_method: true,
      }).then((result) => {
        const { error, paymentIntent } = result;

        if (error) {
          Vue.set(errors, 'card', error.message);

          callback(result.error)
        } else {
          setPaymentSource(paymentIntent, callback);
        }
      });
    },

    setPaymentSource({ source, id }, callback) {
      const { sessionId, planCode } = this;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/use-source`,
        method: "post",
        data: {
          sourceId: source,
          paymentIntentId: id,
          sessionId,
          planCode
        }
      }).then(({ data }) => {
        callback()
      });
    },

    clearError(property) {
      const { errors } = this;

      Vue.set(errors, property, null);
    }
  },

  created() {
    const { initAddCard } = this;
    const { stripePk } = dh;
    const referrer = /ref=([^&]*)/.exec(location.search);

    if (referrer && referrer[1]) {
      document.cookie = 'referrer=' + referrer[1] + '; path=/; max-age=2592000'
    }

    if (stripePk) {
      this.publicKey = stripePk;
    } else {
      initAddCard();
    }
  },

  watch: {
    publicKey(value) {
      if (!value) return;

      const stripe = document.createElement("script");

      stripe.onload = this.stripeElementsInit;

      stripe.src = "//js.stripe.com/v3/";
      document.head.appendChild(stripe);
    },
  }
}
</script>

<style lang="scss">
  .dh-stripe {
    min-height: 310px;
    background-color: #fff;
    display: flex;

    .dh-loader {
      align-self: center;
    }

    .dh-owner-row {
      display: flex;
    }

    .dh-input-wrapper {
      width: 100%;

      & + .dh-input-wrapper {
        margin-left: 28px;
      }
    }

    .dh-owner-info {
      flex-grow: 1;
      width: 50%;
      padding: 0 60px 0 28px;
    }

    .dh-card-info {
      flex-grow: 1;
      width: 50%;
      background-color: #F8FAFB;
      border-top-left-radius: 30px;
      padding: 28px 60px;
    }

    .dh-card-wrapper {
      border: double 4px transparent;
      border-radius: 8px;
      background-image: linear-gradient(#F8FAFB, #F8FAFB), linear-gradient(90deg, #661ACE 60.16%, #2665F9 100%);
      background-origin: border-box;
      background-clip: content-box, border-box;

      &.dh-card-wrapper-error {
        background-image: linear-gradient(#F8FAFB, #F8FAFB), linear-gradient( $failColor,  $failColor)
      }
    }

    .dh-card {
      padding: 28px 28px 20px;
      background-image: url(../assets/card-background.png);
      background-position: bottom right;
      background-repeat: no-repeat;
    }

    .dh-card-row {
      display: flex;
      justify-content: space-between;
    }

    .dh-card-input {
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 40px;
      outline: 0;
      padding: 11px 15px;
      background: #fff;
      border: 1px solid #E8ECEF;
      border-radius: 4px;
      width: 100%;

      &.dh-card-number {
        display: flex;
        align-items: center;

        #card-number {
          flex-grow: 1;
        }

        svg {
          width: 36px;
          height: 22px;
        }
      }

      &.dh-card-expiry {
        width: 85px;
      }

      &.dh-card-cvc {
        width: 65px;
      }
    }

    .dh-card-brand-image {
      margin: 0 10px 0 -7px;
    }
  }

  div.el-tooltip__popper.dh-card-error {
    background-color: $failColor;
    padding: 10px 30px;
    max-width: 300px;

    &[x-placement^=bottom] .popper__arrow {
      border-bottom-color: $failColor;

      &:after {
        border-bottom-color: $failColor;
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
