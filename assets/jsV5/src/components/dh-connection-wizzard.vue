<template>
   <el-dialog
    :visible.sync="isShow"
    width="554px"
    append-to-body
    class="dh-wizzard-dialog"
  >
    <div class="dh-wizzard-steps">
      <component :is="wizzardState"></component>
    </div>
    <template slot="footer">
      <button class="dh-button dh-danger-button" @click="$emit('success')">Deactivate campaign</button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {

    }
  },

  props: ['authAccount'],

  computed: {
    wizzardState() {
      const { authAccount } = this;

      if (!authAccount) {
        return 'selectAccount'
      }
    }
  }
}
</script>

<style lang="scss">

</style>