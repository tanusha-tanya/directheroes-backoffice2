<template>
  <div class="dh-button-wrapper">
    <el-button class="dh-button">
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "DhButton",

    props: ["type", "size", "plain", "disabled", "autofocus"]
  }
</script>