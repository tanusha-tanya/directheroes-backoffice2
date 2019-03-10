<template>
  <div class="stripe-payment">
    <form @submit.prevent="createCardToken" ref="paymentForm" v-show="stripe">
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
      :canSendInfo="allOwnerInfo() && !hasError"
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
      stripe: null,
      errors: {},
      globalError: null,
    }
  },

  props:['goal', 'returnUrl'],

  computed: {
    hasError() {
      const { errors } = this;

      return Object.keys(errors).some(error => errors[error]);
    }
  },

  methods: {
    allOwnerInfo() {
      const { owner } = this;

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

      this.stripe = stripe;
      this.cardNumber = cardNumber;
    },

    createCardToken(price, callback) {
      const {
        sessionId,
        stripe,
        cardNumber,
        owner,
        clientSecret,
        // attachSourceTo,
        setPaymentSource,
        // threeDSecure
      } = this;

      stripe.handleCardPayment(clientSecret, cardNumber,{
        source_data: {
          owner
        }
      }).then(function(result) {
        if (result.error) {
          // Display error.message in your UI.
        } else {
          setPaymentSource(result.paymentIntent, callback);
          // The payment has succeeded. Display a success message.
        }
      });

      // stripe
      //   .createSource(cardNumber, {
      //     owner
      //   })
      //   .then(result => {
      //     const { source, error } = result;

      //     if (error) {
      //       return callback(error)
      //     }

      //     if (
      //       ["required", "recommented"].includes(source.card.three_d_secure)
      //     ) {
      //       attachSourceTo(source.id).then(({ data }) => {
      //         const { customer, three_d_s_return_url } = data.response.body;

      //         threeDSecure(source.id, customer.id, three_d_s_return_url, price);
      //       });
      //     } else {
      //       setPaymentSource(source.id, callback);
      //     }
      //   });
    },

    // threeDSecure(sourceId, customer, return_url, price) {
    //   const { stripe } = this;

    //   stripe
    //     .createSource({
    //       type: "three_d_secure",
    //       amount: price,
    //       three_d_secure: {
    //         card: sourceId,
    //         customer
    //       },
    //       currency: "usd",
    //       redirect: {
    //         return_url
    //       }
    //     })
    //     .then(result => {
    //       const { source } = result;

    //       window.location.href = source.redirect.url;
    //     });
    // },

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

    attachSourceTo(sourceId) {
      const { sessionId } = this;

      return axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/save-source`,
        method: "post",
        data: {
          sourceId,
          sessionId
        }
      });
    },
  },

  created() {
    const { goal, returnUrl } = this;

    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/init-add-card`,
      params: { goal, return_url: encodeURIComponent(returnUrl) }
    }).then(({ data }) => {
      const { stripePk, previousSourceOwner, paymentIntent, sessionId, authorizeAmount, chargeAmount } = data.response.body;

      this.publicKey = stripePk;
      this.sessionId = sessionId;
      this.authorizeAmount = authorizeAmount;
      this.chargeAmount = chargeAmount;
      this.clientSecret = paymentIntent.clientSecret;

      if (!previousSourceOwner) return;

      Object.assign(this.owner, previousSourceOwner);
    });
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
