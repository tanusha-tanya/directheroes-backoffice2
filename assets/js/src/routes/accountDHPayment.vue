<template>
  <div class="account-dh-payment" v-if="!loading">
    <div v-if="!isSetPayment">
      <div class="form-row">
        <label>Address
          <div>{{owner.address.line1}}</div>
        </label>
        <label>Country
          <div>{{owner.address.country}}</div>
        </label>
      </div>
      <div class="form-row">
        <label>City
          <div>{{owner.address.city}}</div>
        </label>
        <label>State/Province
          <div>{{owner.address.state}}</div>
        </label>
        <label>ZIP
          <div>{{owner.address.postal_code}}</div>
        </label>
      </div>
      <div class="form-row">
        <label>Card number
          <div>**** **** **** {{cardInfo.last4}}</div>
        </label>
        <label>Expires, month/year
          <div>{{ cardInfo.expMonth }}/{{ cardInfo.expYear }}</div>
        </label>
      </div>
      <button @click="isSetPayment = true" v-if="false">Update payment info</button>
    </div>
    <form @submit.prevent="createCardToken" ref="paymentForm" v-show="isSetPayment">
      <div class="form-row">
        <label>
          Address
          <input v-model="owner.address.line1" autofocus>
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
      <div class="form-buttons">
        <button
          :class="{loading: paymentRequest}"
          :disabled="!allOwnerInfo() || hasError || paymentRequest"
        >Pay {{ dhAccount.subscription.price }}$ for {{ dhAccount.subscription.planName }}</button>
        <button class="cancel" @click.prevent="isSetPayment = false" v-if="false">Cancel</button>
      </div>
    </form>
  </div>
  <div class="loading-content account-dh-loader" v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";

export default {
  data() {
    return {
      isSetPayment: false,
      loading: true,
      paymentRequest: false,
      publicKey: null,
      owner: {
        address: {
          line1: "",
          city: "",
          postal_code: "",
          country: "",
          state: ""
        }
      },
      globalError: null,
      cardInfo: null,
      stripe: null,
      cardNumber: null,
      errors: {}
    };
  },

  computed: {
    hasError() {
      const { errors } = this;

      return Object.keys(errors).some(error => errors[error]);
    }
  },

  methods: {
    errorHandler(event) {
      const { errors } = this;
      const { error, elementType } = event;

      Vue.set(errors, elementType, error && error.message);
    },

    createCardToken() {
      const {
        stripe,
        cardNumber,
        owner,
        dhAccount,
        attachSourceTo,
        setPaymentSource,
        threeDSecure
      } = this;

      this.paymentRequest = true;

      stripe
        .createSource(cardNumber, {
          owner: {
            ...owner,
            email: dhAccount.username,
            name: `${dhAccount.firstName} ${dhAccount.lastName}`
          }
        })
        .then(result => {
          const { source, error } = result;

          if (
            ["required", "recommented"].includes(source.card.three_d_secure)
          ) {
            attachSourceTo(source.id).then(({ data }) => {
              const { customer, three_d_s_return_url } = data.response.body;

              threeDSecure(source.id, customer.id, three_d_s_return_url);
            });
          } else {
            setPaymentSource(source.id);
          }
        });
    },

    threeDSecure(sourceId, customer, return_url) {
      const { stripe, dhAccount } = this;

      stripe
        .createSource({
          type: "three_d_secure",
          amount: dhAccount.subscription.price,
          three_d_secure: {
            card: sourceId,
            customer
          },
          currency: "usd",
          redirect: {
            return_url
          }
        })
        .then(result => {
          const { source } = result;

          window.location.href = source.redirect.url;
        });
    },

    setPaymentSource(sourceId) {
      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/use-source`,
        method: "post",
        data: {
          sourceId
        }
      }).then(({ data }) => {
        console.log(data);
        this.paymentRequest = false;
        // this.owner = source.owner;
        // this.cardInfo = source.card;
        // this.isSetPayment = false;
      });
    },

    attachSourceTo(sourceId) {
      return axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/save-source`,
        method: "post",
        data: {
          sourceId
        }
      });
    },

    allOwnerInfo() {
      const { owner } = this;

      return Object.keys(owner.address).every(
        ownerItem => owner.address[ownerItem]
      );
    },

    stripeElementsInit() {
      const { errorHandler } = this;
      const stripe = Stripe(this.publicKey);
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
    }
  },

  created() {
    const { dhAccount } = this;
    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/get-source`
    }).then(({ data }) => {
      const { pk, sources } = data.response.body;
      const source = sources[sources.length - 1];

      this.publicKey = pk;
      this.loading = false;

      this.isSetPayment = true //dhAccount && !dhAccount.subscription.isActive;

      if (!source) return;

      Object.assign(this.owner.address, source.address);
      this.cardInfo = source.card;
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

    dhAccount(dhAccount) {
      console.log(dhAccount);
    }
  }
};
</script>
<style lang="scss">
.account-dh-payment {
  padding: 20px;

  .error {
    color: #ff4d4d;
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

  .form-buttons {
    display: flex;
    justify-content: space-between;

    .cancel {
      background-color: transparent;
      color: #000;
    }
  }

  .StripeElement {
    border: 1px solid #dddddd;
    border-radius: 8px;
    padding: 10px;
    font-size: 15px;
  }
}
.account-dh-loader {
  height: calc(100% - 40px);
}
</style>
