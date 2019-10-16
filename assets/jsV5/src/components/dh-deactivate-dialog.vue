<template>
  <el-dialog
    :visible.sync="isShow"
    width="554px"
    append-to-body
    class="dh-deactivate-dialog"
  >
    <template slot="title">
      <div class="el-dialog__title">
        Are you sure you wish to deactivate<br><strong>{{campaignName}}</strong> campaign?
      </div>
    </template>
    <div class="dh-deactivate-body">
      By deactivating your campaign, contacts could end up not finishing the flow.<br><br>
      If this campaign gets re-activated through the campaign builder page. contacts will continue from where they finished off.<br><br>
      Note: If a contact enters a new campaign while this one is still deactivated, the contacts will no longer continue through this flow if reactivated.
    </div>
    <template slot="footer">
      <button class="dh-button dh-danger-button" @click="$emit('success')">Deactivate campaign</button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: ['value', 'campaignName'],

  computed: {
    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    }
  },

  methods: {
    cancelHandler() {
      this.$emit('cancel'),
      this.isShow = false
    }
  }
}
</script>

<style lang="scss">
.dh-deactivate-dialog .el-dialog{
  .el-dialog__title {
    text-align: center;
  }

  .dh-deactivate-body {
    text-align: center;
  }

  .el-dialog__footer {
    justify-content: center;
  }
}
</style>