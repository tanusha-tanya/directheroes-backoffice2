<template>
  <div class="dh-stripe">
    <!-- <slot v-if="stripe" name="footer"
      :submitPayment="createCardToken"
      :canSendInfo="cardInfoComplete && allOwnerInfo() && !hasError"
      :authorizeAmount="authorizeAmount"
    ></slot> -->
  </div>
</template>

<script>

export default {
  data() {
    return {
      stripeData: null
    }
  }
}
</script>

<style lang="scss">
  .dh-stripe {
    min-height: 310px;
    background-color: #fff;
  }
</style>