<template>
  <component class="dh-card-brand-image" :is="type.toLowerCase()"></component>
</template>

<script>
import alipay from '../assets/cardbrands/alipay.svg'
import amex from '../assets/cardbrands/amex.svg'
import diners from '../assets/cardbrands/diners.svg'
import discover from '../assets/cardbrands/discover.svg'
import elo from '../assets/cardbrands/elo.svg'
import hiper from '../assets/cardbrands/hiper.svg'
import hipercard from '../assets/cardbrands/hipercard.svg'
import jcb from '../assets/cardbrands/jcb.svg'
import maestro from '../assets/cardbrands/maestro.svg'
import mastercard from '../assets/cardbrands/mastercard.svg'
import mir from '../assets/cardbrands/mir.svg'
import paypal from '../assets/cardbrands/paypal.svg'
import unionpay from '../assets/cardbrands/unionpay.svg'
import visa from '../assets/cardbrands/visa.svg'


export default {
  props: ['type'],

  components: {
    alipay,
    amex,
    diners,
    discover,
    elo,
    hiper,
    hipercard,
    jcb,
    maestro,
    mastercard,
    mir,
    paypal,
    unionpay,
    visa
  }
}
</script>

<style lang="scss">
  .dh-card-brand-image {
    width: 60px;
  }
</style>