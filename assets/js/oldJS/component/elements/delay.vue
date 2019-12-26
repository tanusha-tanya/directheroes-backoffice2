<template>
  <div class="delay-action">
    <span>
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 10c0-4.41-3.59-8-8-8s-8 3.59-8 8 3.59 8 8 8 8-3.59 8-8m2 0c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0s10 4.477 10 10m-4 1a1 1 0 0 1-1 1h-4a2 2 0 0 1-2-2V5a1 1 0 0 1 2 0v4c0 .55.45 1 1 1h3a1 1 0 0 1 1 1" fill="currecnColor" fill-rule="evenodd"/></svg>
      Delay
    </span>
    <timeout :element="element"></timeout>
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

    & > span {
      line-height: 28px;
      font-size: 12px;
      font-family: sans-serif;
    }

    .timeout {
      margin-left: 2px;
    }

    svg {
      width: 10px;
      height: 10px;
      opacity: .45;
      margin-right: 3px;
    }
  }
</style>