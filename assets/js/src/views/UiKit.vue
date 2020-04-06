<template>
  <div class="uikit">
    <div class="uikit__body">
      <div class="uikit__buttons">
        <dh-button>test</dh-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss">
  .uikit {
    
    .uikit__body {
      display: flex;
      flex-direction: column;
    }

    .uikit__buttons {
      display: flex;
      justify-content: space-between;
    }
  }
</style>