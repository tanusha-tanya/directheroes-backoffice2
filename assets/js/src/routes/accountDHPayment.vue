<template>
  <div class="account-dh-payment" v-if="!loading">
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
          <div>{{ cardInfo.expMonth }}/{{ cardInfo.expYear }}</div>
        </label>
      </div>
      <button @click="isSetPayment = true">Update payment info</button>
    </div>
    <stripe-payment v-show="isSetPayment">
      <template slot="footer" slot-scope="{submitPayment, canSendInfo}">
        <div class="form-buttons">
          <button :class="{ loading: paymentRequest }" :disabled="!canSendInfo" @click="setPayInfo(submitPayment)">Save payment info</button>
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
      cardInfo: null,
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
    setPayInfo(submitPayment) {
      this.paymentRequest = true

      submitPayment(97000, (error) => {
        this.paymentRequest = false;

        if (error) return;

        this.isSetPayment = false;
      });
    }
  },

  created() {
    const { dhAccount } = this;
    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/get-source`
    }).then(({ data }) => {
      const { sources } = data.response.body;
      const source = sources[sources.length - 1];

      this.loading = false;
      console.log(source);


      if (!source) return;

      Object.assign(this.owner, source);
      this.cardInfo = source.card;
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
