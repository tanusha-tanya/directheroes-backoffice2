<template>
  <div class="account-dh-payment" v-if="!loading">
    <div style="
    padding: 1rem;
    background: #c2b9ff;
    border-radius: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem;" v-if="!cardInfo.last4">
      You will be charged <strong>$97</strong> and subscribed to <strong>Hero</strong> plan
    </div>
    <div v-if="!isSetPayment">
      <div class="form-row">
        <label>Full Name
          <div>{{owner.name}}</div>
        </label>
      </div>
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
          <div>{{ cardInfo.exp_month }}/{{ cardInfo.exp_year }}</div>
        </label>
      </div>
      <button @click="isSetPayment = true">Set payment info</button>
    </div>
    <stripe-payment v-if="isSetPayment" goal="createPlanSubscription" :return-url="$router.resolve({name: 'dhPayments'}).href">
      <template slot="footer" slot-scope="{submitPayment, canSendInfo, authorizeAmount}">
        <div class="form-buttons">
          <button :class="{ loading: paymentRequest }" :disabled="!canSendInfo" @click="setPayInfo(submitPayment, authorizeAmount)">Save payment info</button>
          <button class="cancel" @click="isSetPayment = false" >Cancel</button>
        </div>
      </template>
    </stripe-payment>
  </div>
  <div class="loading-content account-dh-loader" v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import stripePayment from '../component/stripePayment.vue'

export default {
  data() {
    return {
      isSetPayment: false,
      loading: true,
      paymentRequest: false,
      cardInfo: {},
      owner: {
        address: {

        }
      }
    };
  },

  components: {
    stripePayment
  },

  methods: {
    setPayInfo(submitPayment, authorizeAmount) {
      const { $router } = this
      this.paymentRequest = true

      submitPayment(authorizeAmount * 100, (error) => {
        this.paymentRequest = false;

        if (error) return;

        this.isSetPayment = false;
      });
    }
  },

  created() {
    const { dhAccount } = this;

    if (dhAccount && !dhAccount.subscription.isActive) {
      this.isSetPayment = true;
    }

    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/get-source`
    }).then(({ data }) => {
      const { activeSource } = data.response.body;

      if (!activeSource) return;

      Object.assign(this.owner, activeSource.owner ||
        {
          name: activeSource.name,
          address: {
            city: activeSource.address_city,
            country: activeSource.address_country,
            line1: activeSource.address_line1,
            line2: activeSource.address_line2,
            state: activeSource.address_state,
            postal_code: activeSource.address_zip,
          }
        });

      this.owner.address = this.owner.address || {};
      this.cardInfo = activeSource.card || activeSource.three_d_secure || activeSource || {};

      this.loading = false;
    });
  }
};
</script>
<style lang="scss">
.account-dh-payment {
  padding: 20px;

  .form-buttons {
    display: flex;
    justify-content: space-between;

    .cancel {
      background-color: transparent;
      color: #000;
    }
  }

}
.account-dh-loader {
  height: calc(100% - 40px);
}
</style>
