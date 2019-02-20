<template>
  <div class="extra-account-payment">
    <div class="container-area w800">
      <div class="extra-account-header">
        Set Your Credit/Debit Card Information
      </div>
      <div class="extra-account-stripe">
        <stripe-payment>
          <template slot="footer" slot-scope="{submitPayment, canSendInfo}">
            <div class="extra-account-buttons">
              <button :class="{ loading: sendRequest }" :disabled="!canSendInfo" @click="extraAccountPay(submitPayment)">Pay 97$ for extra account</button>
              <router-link :to="{ name: 'accountBuy' }">Cancel</router-link>
            </div>
          </template>
        </stripe-payment>
      </div>
    </div>
  </div>
</template><script>
import stripePayment from '../component/stripePayment.vue'
import axios from "axios"

export default {
  data() {
    return {
      sendRequest: false
    }
  },

  components: {
    stripePayment
  },

  methods: {
    extraAccountPay(submitPayment) {
      this.sendRequest = true

      submitPayment(97000, (error) => {
        this.sendRequest = false;

        if (error) return;

        this.$router.replace({ name: 'accountBuy' })
      });
    }
  }
}
</script>

<style lang="scss">
.extra-account-payment {
  padding: 20px;
  height: calc(100% - 50px);
  display: flex;
  align-items: center;

  .extra-account-header {
    background: #F7F7F7;
    border-bottom: 1px solid #DBDBDB;
    border-radius: 10px 10px 0 0;
    font-weight: bold;
    font-size: 22px;
    padding: 27px 34px;
  }

  .extra-account-stripe {
    padding: 35px 35px 0;

    .loading-content {
      padding-bottom: 35px;
    }
  }

  .extra-account-buttons {
    margin-top: 35px;
    border-top: 1px solid #DBDBDB;
    padding: 25px 0;
    display: flex;
    justify-content: flex-end;

    button {
      background: #6A12CB;
      border-radius: 100px;
      line-height: 16px;
      font-size: 16px;
      padding: 14px 50px;
    }

    a {
      line-height: 16px;
      font-size: 16px;
      padding: 14px 50px;
      color: #000;
      margin-left: 10px;
      text-decoration: none;
      font-weight: 600;
    }
  }
}

</style>
