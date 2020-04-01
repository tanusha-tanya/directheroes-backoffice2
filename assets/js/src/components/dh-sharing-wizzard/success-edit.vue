<template>
  <div class="dh-wizzard-step dh-changes-success">
    <div class="dh-wizzard-step-body">
      <div
        :class="{'dh-wizzard-success': isShared, 'dh-wizzard-error': !isShared}"
      >
      <template v-if="isShared">
        @{{account.login}} backoffice access permissions have been successfully saved for {{delegate.username}}
      </template>
      <template v-else>
        You have denied access to @{{account.login}} backoffice for {{delegate.username}}
      </template>
    </div>
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-reset-button" @click="$emit('to-change-permissions')">Back</button>
      <button class="dh-button" @click="$emit('success')">Ok</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["delegate", "account"],

  computed: {
    isShared() {
      const { delegate, account } = this;

      return delegate.igAccounts.find(a => a.id === account.id);
    }
  }
};
</script>

<style lang="scss">
.dh-changes-success {
  .el-dialog__footer {
    justify-content: flex-end;
  }
}
</style>