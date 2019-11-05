<template>
  <div class="dh-settings-form dh-profile-general">
    <div class="dh-settings-title">
      Billing settings
    </div>
    <loader v-if="loading"/>
    <div v-else>
      <div style="
        padding: 1rem;
        background: #c2b9ff;
        border-radius: 1rem;
        margin-bottom: 1rem;
        font-size: 1rem;" v-if="!cardInfo.last4">
          You will be charged <strong>$97</strong> and subscribed to <strong>Hero</strong> plan
        </div>
      <div v-if="!isSetPayment">
        <div class="dh-settings-form-row">
          <label class="dh-label">
            <span>Full Name</span>
            <input class="dh-input" type="text" :value="owner.name" readonly>
          </label>
        </div>
        <div class="dh-settings-form-row">
          <label class="dh-label">
            <span>Address</span>
            <input class="dh-input" type="text" :value="owner.address.line1" readonly>
          </label >
          <label class="dh-label">
            <span>Country</span>
            <input class="dh-input" type="text" :value="owner.address.country" readonly>
          </label>
        </div>
        <div class="dh-settings-form-row">
          <label class="dh-label">
            <span>City</span>
            <input class="dh-input" type="text" :value="owner.address.city" readonly>
          </label>
          <label class="dh-label">
            <span>State/Province</span>
            <input class="dh-input" type="text" :value="owner.address.state" readonly>
          </label>
          <label class="dh-label">
            <span>ZIP</span>
            <input class="dh-input" type="text" :value="owner.address.postal_code" readonly>
          </label>
        </div>
        <div class="dh-settings-form-row">
          <label class="dh-label">
            <span>Card number</span>
            <input class="dh-input" type="text" :value="`**** **** **** ${cardInfo.last4}`" readonly>
          </label>
          <label class="dh-label">
            <span>Expires, month/year</span>
            <input class="dh-input" type="text" :value="`${cardInfo.exp_month }/${ cardInfo.exp_year }`" readonly>
          </label>
        </div>
      </div>
      <stripe-payment v-else goal="updateExistingSubscriptions" :return-url="$router.resolve({name: 'dhPayments'}).href">
        <template slot="footer" slot-scope="{submitPayment, canSendInfo, authorizeAmount}">
          <div class="dh-settings-form-buttons">
            <button :class="{ 'dh-button': true, 'dh-loading': paymentRequest }" :disabled="!canSendInfo" @click="setPayInfo(submitPayment, authorizeAmount)">Save payment info</button>
            <button class="dh-button dh-reset-button" @click="isSetPayment = false" >Cancel</button>
          </div>
        </template>
      </stripe-payment>
    </div>
    <div class="dh-spacer"></div>
    <div class="dh-settings-form-footer" v-if="!isSetPayment && !loading">
      <button class="dh-button" @click="isSetPayment = true">Set payment info</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import loader from '../components/dh-loader'

import stripePayment from '../oldJS/component/stripePaymentV5'

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
    }
  },

  components: {
    loader,
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
}
</script>

<style lang="scss">
.dh-profile-general {
  .dh-settings-form-buttons {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }
}
</style>