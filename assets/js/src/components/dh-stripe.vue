<template>
  <div class="dh-stripe">
    <div class="dh-owner-info">
      <div class="dh-owner-row">
        <dh-input label="Full name" v-model="owner.name"></dh-input>
      </div>
      <div class="dh-owner-row">
        <dh-input label="Address" v-model="owner.address.line1"></dh-input>
        <dh-input label="Country" v-model="owner.address.country"></dh-input>
      </div>
      <div class="dh-owner-row">
        <dh-input label="City" v-model="owner.address.city"></dh-input>
        <dh-input label="State/Province" v-model="owner.address.state"></dh-input>
        <dh-input label="ZIP" v-model="owner.address.postal_code"></dh-input>
      </div>
    </div>
    <div class="dh-card-info">
      <div class="dh-card-wrapper">
        <div class="dh-card">
          <label class="dh-input-wrapper">
            <span class="dh-input__header">Card number</span>
            <div class="dh-card-input">
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
    </div>
    <!-- <slot v-if="stripe" name="footer"
      :submitPayment="createCardToken"
      :canSendInfo="cardInfoComplete && allOwnerInfo() && !hasError"
      :authorizeAmount="authorizeAmount"
    ></slot> -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      stripe: null,
      publicKey: null,
      clientSecret: null,
      cardInfoComplete: false,
      errors: {},
      globalError: null,
      cardNumber: null,
      cardCvc: null,
      cardExpiry: null,
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

  props: ['goal'],

  methods: {
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

      &.dh-card-expiry {
        width: 63px;
      }
    }
  }
</style>
