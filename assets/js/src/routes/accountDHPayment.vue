<template>
<div class="account-dh-payment">
  <form @submit.prevent="createCardToken" ref="paymentForm" v-show="stripe">
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
      <label>
        Card number
        <div id="card-number"></div>
      </label>
    </div>
    <div class="form-row">
      <label>
        Expires, month/year
        <div id="card-expiry"></div>
      </label>
      <label>
        CVC
        <div id="card-cvc"></div>
      </label>
    </div>
    <button :disabled="!allOwnerInfo()">Save payments info</button>
  </form>
</div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      publicKey: null,
      owner: {
        address: {
          line1: '',
          city: '',
          postal_code: '',
          country: '',
          state: ''
        }
      },
      stripe: null,
      cardNumber: null
    }
  },

  methods: {
    createCardToken() {
      const { stripe, cardNumber, owner} = this;

      stripe.createSource(cardNumber, { owner }).then(result => {
        const { source, error } = result;

        if (['required', 'recommented'].includes(source.card.three_d_secure)) {
          this.attachSourceTo(source.id).then(({ data }) => {
            const { customer, three_d_s_return_url } = data.response.body;

            this.threeDSecure(source.id, customer.id, three_d_s_return_url)
          })
        } else {

        }
      });
    },

    threeDSecure(sourceId, customer, return_url) {
      const { stripe } = this;

      stripe.createSource({
        type: 'three_d_secure',
        amount: 10000,
        three_d_secure: {
          card: sourceId,
          customer
        },
        currency: 'usd',
        redirect: {
          return_url
        }
      }).then(result => {
        const { source } = result;

        window.location.href = source.redirect.url;
      })
    },

    attachSourceTo(sourceId) {
      return axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/stripe/save-source`,
        method: 'post',
        data: {
          sourceId
        }
      })
    },

    saveSource() {

    },

    allOwnerInfo() {
      const { owner } = this;

      return Object.keys(owner.address).every(ownerItem => owner.address[ownerItem])
    },

    stripeElementsInit() {
      const stripe = Stripe(this.publicKey);
      const elements = stripe.elements();
      const cardNumber = elements.create('cardNumber');
      const cardExpiry = elements.create('cardExpiry');
      const cardCvc = elements.create('cardCvc')

      cardNumber.mount('#card-number')
      cardExpiry.mount('#card-expiry')
      cardCvc.mount('#card-cvc');

      this.stripe = stripe;
      this.cardNumber = cardNumber;
    }
  },

  created() {
    axios({
      url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/stripe/get-source`
    }).then(({ data }) => {
      const { pk, source } = data.response.body;

      this.publicKey = pk;
    })
  },

  watch: {
    publicKey(value) {
      if (!value) return;

      const  stripe = document.createElement('script');

      stripe.onload = this.stripeElementsInit

      stripe.src = "//js.stripe.com/v3/";
      document.head.appendChild(stripe);
    }
  }
}
</script>
<style lang="scss">
.account-dh-payment {
  padding: 20px;

  .form-row {
    display: flex;
    margin: 0 -10px 10px;

    label {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin: 0 10px;
    }
  }
}
</style>
