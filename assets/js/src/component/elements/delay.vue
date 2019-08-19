<template>
  <div class="delay-action">
    Delay <timeout :element="element"></timeout>
  </div>
</template>

<script>
import timeout from '../timeout'

export default {
  props: ['element'],

  components: {
    timeout
  }
}
</script>

<style lang="scss">
  .delay-action {
    padding: 10px 10px 10px 20px;
    border:1px solid #D8D8D8;
    border-radius: 5px;
    background-color: #fff;
    color: #2D2D2D;
    text-align: center;
    cursor: default;
    display: flex;
    justify-content: center;
    align-items: center;

    .timeout {
      margin-left: 2px;
    }
  }
</style>