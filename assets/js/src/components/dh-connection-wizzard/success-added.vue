<template>
  <div class="dh-wizzard-step dh-success-added">
    <div class="dh-wizzard-step-body">
      <div class="dh-wizzard-success" >
        Instagram account connected successfully
      </div>
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button" @click="$emit('close-wizzard')">Ok</button>
    </div>
  </div>
</template>
