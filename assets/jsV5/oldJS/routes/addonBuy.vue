<template>
  <div class="buy-extra-account">
    <div class="container-area">
      <div class="container-header">
        Plans
      </div>
      <div class="container-body">
        <div class="loading-content" v-if="inGetPlanes">
          <div class="pre-loader"></div>
        </div>
        <template v-else>
          <div class="plane-item" v-for="codeItem in code" :key="codeItem.code">
            <div>
              <strong>{{codeItem.name}}</strong>
              <div>{{codeItem.description}}</div>
            </div>
            <div class="plane-price">${{codeItem.price}}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="container-area">
      <div class="container-header">
        Payment
      </div>
      <loader v-if="loading"/>
      <div class="container-body" v-else>
        <div class="error-state" v-if="error">
          {{ error }}
        </div>
        <div class="purchase-info" v-else-if="cardInfo">
          <div class="card-info">
            {{ cardInfo.brand }} *{{ cardInfo.last4 }}<br/>
            Expires on {{ cardInfo.exp_month }}/{{ cardInfo.exp_year }}
          </div>
          <button @click="buyPlane" :class="{'dh-button': true, 'dh-loading': purchasing}" :disabled="purchasing">Purchase</button>
        </div>
        <div class="purchase-info" v-else>
          No card attached to service
        </div>
        <div class="payment-buttons">
          <router-link class="dh-button" tag="button" :to="{ name: 'addonPayment' }">Edit payment method</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import loader from '../../../jsV5/src/components/dh-loader';

export default {
  data() {
    return {
      loading: true,
      cardInfo: null,
      purchasing: false,
      inGetPlanes: false,
      error: null,
      code: null,
    }
  },

  components: {
    loader
  },

  methods: {
    buyPlane() {
      const { code } = this;

      this.error = false;
      this.purchased = false;
      this.purchasing = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/add-subscription`,
        method: 'post',
        data: {
          cartItems: code.map(plan => {
            return {
              plan: plan.code,
              quantity: 1
            }
          })
        }
      }).then(({ data }) => {
        const { success, error } = data.request;
        const { dhAccount } = data.response.body;
        this.purchasing = false;

        if (success) {
          this.$store.commit('set', { path:'dhAccount', value: dhAccount })
          this.$router.push({ name: 'accounts', params:{ isBuy: 'add'}})
        } else {
          this.error = error.message;
        }
      }).catch(error => {
        this.error = 'Server connection problem, try again';
        this.purchasing = false;
      })
    }
  },

  created() {
    let { code } = this.$route.query;

    code = Array.isArray(code) ? code : [code];

    this.inGetPlanes = true;

    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/get-subscription-info`,
      params: {
        code
      }
    }).then(({ data }) => {
      this.inGetPlanes = false;

      this.code = data.planList
    })

    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/get-source`
    }).then(({ data }) => {
      const { activeSource } = data.response.body;

      this.loading = false;

      if (!activeSource) return;

      this.cardInfo = activeSource.card || activeSource.three_d_secure;
    });
  },
}
</script>

<style lang="scss">
  .buy-extra-account {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-direction: column;

    .container-area {
      width: 680px;
      padding: 21px 37px;

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }

    .container-header {
      font-size: 20px;
      border-bottom: 1px solid $secondBorderColor;
      padding-bottom: 21px;
      font-weight: 500;
      margin-bottom: 22px;
      color: #3C3C3C;
    }

    .container-body {
      font-size: 18px;
      color: #828282;
    }

    .plane-item {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .plane-price {
        font-size: 24px;
        font-weight: 500;
      }

      strong {
        font-size: 16px;
        margin-bottom: 5px;
      }

      &:not(:first-child) {
        margin-top: 10px;
      }
    }

    .purchase-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 22px;
      border-bottom: 1px solid $secondBorderColor;
      margin-bottom: 19px;
    }

    .purchased-state, .error-state {
      padding-bottom: 22px;
      border-bottom: 1px solid $secondBorderColor;
      margin-bottom: 19px;
      line-height: 20px;
    }

    .error-state {
      color: $failColor;
    }

    .card-info {
      line-height: 25px;
      color: #606060;
    }

    .payment-buttons {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
