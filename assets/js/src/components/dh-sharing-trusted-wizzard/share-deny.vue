<template>
  <div class="dh-wizard-step dh-share-deny">
    <div class="dh-wizard-step-body">
      <div>You are about to deny user {{ delegate.username }} to access Instagram account @{{ account.login }}.</div>
      <div>Please select the most suitable option:</div>
      <div class="dh-deny-options">
        <el-radio v-model="isUntrusted" :label="true">Deny this time and never ask again</el-radio>
        <el-radio v-model="isUntrusted" :label="false">Deny this time, but ask again when attaching a new Instagram account</el-radio>
      </div>
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-reset-button" @click="$emit('cancel')">Back</button>
      <button
        :class="{'dh-button': true, 'dh-loading': denying}"
        :disabled="isUntrusted === null"
        @click="onDeny"
      >Deny</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["delegate", "account"],

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
}
</style>