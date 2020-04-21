<template>
  <div class="dh-wizard-step dh-success-added">
    <div class="dh-wizard-step-body">
      <div class="dh-wizard-success" >
        Instagram account connected successfully
      </div>
    </div>
    <div class="el-dialog__footer">
      <span></span>
      <button class="dh-button" @click="$emit('close-wizard')">Ok</button>
    </div>
  </div>
</template>
