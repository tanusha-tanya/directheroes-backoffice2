<template>
  <div class="stripe-payment">
    <form @submit.prevent="" ref="paymentForm" v-show="stripe">
      <div class="form-row">
        <label>
          Full Name
          <input v-model="owner.name" autofocus>
        </label>
      </div>
      <div class="form-row">
        <label>
          Address
          <input v-model="owner.address.line1">
        </label>
        <label>
          Country
          <input v-model="owner.address.country">
        </label>
      </div>
      <div class="form-row">
        <label>
          City
          <input v-model="owner.address.city">
        </label>
        <label>
          State/Province
          <input v-model="owner.address.state">
        </label>
        <label>
          ZIP
          <input v-model="owner.address.postal_code">
        </label>
      </div>
      <div class="form-row">
        <label>Card number
          <div id="card-number"></div>
          <div class="error">{{errors.cardNumber}}</div>
        </label>
      </div>
      <div class="form-row">
        <label>Expires, month/year
          <div id="card-expiry"></div>
          <div class="error">{{errors.cardExpiry}}</div>
        </label>
        <label>CVC
          <div id="card-cvc"></div>
          <div class="error">{{errors.cardCvc}}</div>
        </label>
      </div>
      <div class="error">{{globalError}}</div>
    </form>
    <div class="loading-content" v-show="!stripe">
      <div class="pre-loader"></div>
    </div>
    <slot v-if="stripe" name="footer"
      :submitPayment="createCardToken"
      :canSendInfo="cardInfoComplete && allOwnerInfo() && !hasError"
      :authorizeAmount="authorizeAmount"
      ></slot>
  </div>
</template>

<script>
import axios from "axios"
import Vue from 'vue'

export default {
  data() {
    return {
      chargeAmount: null,
      authorizeAmount: null,
      sessionId: null,
      publicKey: null,
      owner: {
        name: "",
        address: {
          line1: "",
          city: "",
          postal_code: "",
          country: "",
          state: ""
        }
      },
      clientSecret: null,
      cardInfoComplete: false,
      stripe: null,
      errors: {},
      globalError: null,
      cardNumber: null,
      cardCvc: null,
      cardExpiry: null,
    }
  },

  props:['goal'],

  computed: {
    hasError() {
      const { errors } = this;

      return Object.keys(errors).some(error => errors[error]);
    }
  },

  methods: {
    allOwnerInfo() {
      const { owner, cardInfoComplete } = this;

      return owner.name && Object.keys(owner.address).every(ownerItem => ownerItem === 'line2' || owner.address[ownerItem]);
    },

    errorHandler(event) {
      const { errors } = this;
      const { error, elementType } = event;

      Vue.set(errors, elementType, error && error.message);
    },

    stripeElementsInit() {
      const { errorHandler } = this;
      const stripe = Stripe(this.publicKey, {
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

    createCardToken(price, callback) {
      const {
        sessionId,
        stripe,
        errors,
        cardNumber,
        owner,
        clientSecret,
        setPaymentSource,
      } = this;

      stripe.handleCardPayment(clientSecret, cardNumber, {
        source_data: {
          owner
        },
        save_payment_method: true,
      }).then(function(result) {
        const { error } = result;

        if (error) {
          if (error.param) {
            let elementType = 'cardNumber';

            switch(error.param) {
              case 'exp_month':
                elementType = 'cardExpiry'
                break;
              case 'cvc':
                elementType = 'cardCvc'
                break;
            }
            Vue.set(errors, elementType, error.message);
          } else {
            Vue.set(errors, 'cardNumber', error.message);
          }

          callback(result.error)
        } else {
          setPaymentSource(result.paymentIntent, callback);
          // The payment has succeeded. Display a success message.
        }
      });
    },


    setPaymentSource({ source, id }, callback) {
      const { sessionId } = this;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/use-source`,
        method: "post",
        data: {
          sourceId: source,
          paymentIntentId: id,
          sessionId
        }
      }).then(({ data }) => {
        callback()
      });
    },

    initAddCard() {
      const { goal, returnUrl } = this;
      const request = axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/init-add-card`,
        params: { goal, return_url: encodeURIComponent(returnUrl) }
      })

      request.then(({ data }) => {
        const { stripePk, previousSourceOwner, paymentIntent, sessionId, authorizeAmount, chargeAmount } = data.response.body;

        this.publicKey = stripePk;
        this.sessionId = sessionId;
        this.authorizeAmount = authorizeAmount;
        this.chargeAmount = chargeAmount;
        this.clientSecret = paymentIntent.clientSecret;

        if (!previousSourceOwner) return;

        Object.assign(this.owner, previousSourceOwner);

        this.owner.address = this.owner.address || {};
      });

      return request;
    },
  },

  created() {
    const { initAddCard } = this;
    const { stripePk } = dh;
    const referrer = /ref=(\w*)/.exec(location.search);

    if (referrer && referrer[1]) {
      document.cookie = 'referrer=' + referrer[1] + '; path=/'
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

    'cardCvc._complete'() {
      const { cardNumber, cardExpiry, cardCvc } = this;

      this.cardInfoComplete = cardNumber._complete && cardExpiry._complete && cardCvc._complete;
    },

    'cardExpiry._complete'() {
      const { cardNumber, cardExpiry, cardCvc } = this;

      this.cardInfoComplete = cardNumber._complete && cardExpiry._complete && cardCvc._complete;
    },

    'cardNumber._complete'() {
      const { cardNumber, cardExpiry, cardCvc } = this;

      this.cardInfoComplete = cardNumber._complete && cardExpiry._complete && cardCvc._complete;
    }
  }
}
</script>

<style  lang="scss">
.error {
  color: #ff4d4d;
}

.StripeElement {
  border: 1px solid #dddddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 15px;
}
</style>
