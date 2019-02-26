<template>
  <div class="buy-extra-account">

    <div class="container-area">
      <div class="container-header">
        Purchase Quota
      </div>
      <div class="container-body">
        Here it can goes details of the package, quota, etc (optional)
      </div>
    </div>
    <div class="container-area">
      <div class="container-header">
        Payment
      </div>
      <div class="loading-content" v-if="loading">
        <div class="pre-loader"></div>
      </div>
      <div class="container-body" v-else>
        <div class="purchased-state" v-if="purchased">
          You have purchased an extra quota. <router-link :to="{ name: 'accounts'}">Go to accounts</router-link> to add Instagram account.
        </div>
        <div class="error-state" v-else-if="error">
          {{ error }}
        </div>
        <div class="purchase-info" v-else-if="cardInfo">
          <div class="card-info">
            {{ cardInfo.brand }} *{{ cardInfo.last4 }}<br/>
            Expires on {{ cardInfo.exp_month }}/{{ cardInfo.exp_year }}
          </div>
          <button @click="buyExtraAccount" :class="{loading: purchasing}">Purchase</button>
        </div>
        <div class="purchase-info" v-else>
          No one card attached to service
        </div>
        <div class="payment-buttons">
          <router-link class="primary" tag="button" :to="{ name: 'accountPayment' }">Set payment method</router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      cardInfo: null,
      purchasing: false,
      error: null,
      purchased: false,
    }
  },

  methods: {
    buyExtraAccount() {
      this.error = false;
      this.purchased = false;
      this.purchasing = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/add-subscription`,
        method: 'post',
        data: {
          type: 'extraAccount',
          quantity: 1
        }
      }).then(({ data }) => {
        const { success } = data.request;
        this.purchasing = false;

        if (success) {
          this.purchased = true;
        } else {
          this.error = "Error  ddddd";
        }
      })
    }
  },

  created() {
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
      border-bottom: 1px solid #C6C6C6;
      padding-bottom: 21px;
      font-weight: bold;
      margin-bottom: 22px;
      color: #3C3C3C;
    }

    .container-body {
      font-size: 18px;
      color: #828282;
    }

    .purchase-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 22px;
      border-bottom: 1px solid #C6C6C6;
      margin-bottom: 19px;

      button {
        background: #6A12CB;
        border-radius: 100px;
        line-height: 16px;
        font-size: 16px;
        padding: 14px 50px;
      }
    }

    .purchased-state, .error-state {
      padding-bottom: 22px;
      border-bottom: 1px solid #C6C6C6;
      margin-bottom: 19px;
      line-height: 20px;
    }

    .error-state {
      color: #ff0048;
    }

    .card-info {
      line-height: 25px;
      color: #606060;
    }

    .payment-buttons {
      display: flex;
      justify-content: flex-end;
    }

    .primary {
      padding: 2px 20px;
      background-color: transparent;
      border: 1px solid #838181;
      border-radius: 100px;
      font-size: 13px;
      color: #838383;
      font-weight: normal;
    }
  }
</style>
