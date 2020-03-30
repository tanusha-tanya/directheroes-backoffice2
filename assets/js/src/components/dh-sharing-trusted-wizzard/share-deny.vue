<template>
  <div class="dh-wizzard-step dh-share-deny">
    <div class="dh-wizzard-step-body">
      <div>Do you want to deny sharing for this account only, or all future accounts too?</div>
      <div class="dh-deny-options">
        <el-radio v-model="isUntrusted" :label="true">Deny for all future accounts too</el-radio>
        <el-radio v-model="isUntrusted" :label="false">Deny for this account</el-radio>
      </div>
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-small dh-reset-button" @click="$emit('cancel')">Back</button>
      <button
        :class="{'dh-button': true, 'dh-small': true, 'dh-loading': denying}"
        :disabled="isUntrusted === null"
        @click="onDeny"
      >Deny</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["delegate"],

  data: () => {
    return {
      isUntrusted: null,
      denying: false
    };
  },

  methods: {
    onDeny() {
      const { isUntrusted, delegate } = this;
      if (!isUntrusted) {
        this.$emit("close-wizzard");
        return;
      }

      this.denying = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/delegate/${delegate.id}`,
        method: "post",
        data: {
          trusted: false
        }
      }).finally(() => {
        this.denying = false;
        this.$emit('close-wizzard');
      });
    }
  }
};
</script>

<style lang="scss">
div.dh-share-deny {
  .dh-deny-options {
    margin-top: 20px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .el-dialog__footer {
    justify-content: flex-end;

    .dh-button {
      margin-left: 8px;
    }
  }
}
</style>