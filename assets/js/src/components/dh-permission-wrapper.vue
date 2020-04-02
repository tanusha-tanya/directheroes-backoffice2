<template>
  <div class="dh-permission__granted" v-if="hasPermission">
    <slot></slot>
  </div>
  <div
    class="dh-permission__denied"
    v-else
    @click.stop.prevent="isPopupVisible = true"
    :key="'disabled'"
  >
    <slot></slot>
    <el-dialog
      :visible.sync="isPopupVisible"
      title="Access denied"
      width="554px"
      append-to-body
      :destroy-on-close="true"
      class="dh-permission__dialog"
    >
      You don’t have permission to access this section
      <template slot="footer">
        <button class="dh-button" @click="isPopupVisible = false">Ok</button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["code"],

  data: () => {
    return {
      isPopupVisible: false
    };
  },

  computed: {
    hasPermission() {
      const { currentAccount, code } = this;
      
      if (!currentAccount || !code) return false;

      if (currentAccount.owner.username === dh.userName) return true;

      const permission = currentAccount.viewerPermissions.account.find(p => p.code === code);
      return (permission && permission.isGranted) || false;
    }
  }
};
</script>

<style lang="scss">
.dh-permission__granted,
.dh-permission__denied {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dh-permission__denied {
  opacity: 0.6;
}
</style>