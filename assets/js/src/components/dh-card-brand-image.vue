<template>
  <component :is="type"></component>
</template>

<script>
import alipay from '../assets/cardbrands/alipay.svg'
import amex from '../assets/cardbrands/amex.svg'
import diners from '../assets/cardbrands/diners.svg'
import discover from '../assets/cardbrands/discover.svg'
import elo from '../assets/cardbrands/elo.svg'
import hiper from '../assets/cardbrands/hiper.svg'
import amex from '../assets/cardbrands/amex.svg'
import amex from '../assets/cardbrands/amex.svg'
import amex from '../assets/cardbrands/amex.svg'
import amex from '../assets/cardbrands/amex.svg'
import amex from '../assets/cardbrands/amex.svg'


export default {
  props: ['type'],

  components: {
    alipay,
    amex,
    diners,
    discover,
    elo,
    hiper,
  }
}
</script>

<style lang="scss">

</style>