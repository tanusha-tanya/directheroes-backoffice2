<template>
  <div class="dh-settings-form dh-profile-general">
    <div class="dh-settings-title">
      General information
    </div>
    <div class="dh-settings-form-row">
      <label class="dh-label">
        <span>First name</span>
        <input type="text" class="dh-input" :value="dhAccount.firstName" readonly>
      </label>
      <label class="dh-label">
        <span>Last name</span>
        <input type="text" class="dh-input" :value="dhAccount.lastName" readonly>
      </label>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.dh-profile-general {
  overflow: auto;
}
</style>