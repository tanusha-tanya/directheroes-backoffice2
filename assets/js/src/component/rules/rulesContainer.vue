<template>
  <div class="rule-container">
    <div class="rule-item">{{rules}}</div>
  </div>
</template>

<script>
export default {
  props: ['elements'],

  computed: {
    rules() {
      const { elements } = this;

      elements.forEach(element => {
        console.log(element);

      })

      return  'Rulez'
    }
  }
}
</script>

<style>

</style>
