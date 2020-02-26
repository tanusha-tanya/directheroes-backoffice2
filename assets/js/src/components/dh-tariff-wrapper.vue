<template>
  <div class="dh-enabled-by-tariff" v-if="true || isEnabled">
    <slot ></slot>
  </div>
  <div class="dh-disabled-by-tariff" v-else @click="showPopup" :key="'disabled'">
    <slot></slot>
    <el-dialog
      :visible.sync="isPopupShown"
      title="Change tariff"
      width="554px"
      append-to-body
      :destroy-on-close="true"
      class="dh-tariff-dialog"
    >
      This feature is only available on a higher plan
      <template slot="footer">
        <button class="dh-button" @click="isPopupShown = false">Ok</button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPopupShown: false
    }
  },

  props: ['isEnabled'],

  methods: {
    showPopup(event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();

      this.isPopupShown = true;
    }
  }
}
</script>

<style lang="scss">
.dh-disabled-by-tariff {
  opacity: .6;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:after {
    content: 'PRO';
    font-size: 12px;
    font-weight: bold;
    background-color: #828282;
    color: #fff;
    padding: 0 5px;
    border-radius: 5px;
    line-height: 18px;
    margin-left: 10px;
  }
}

.dh-tariff-dialog {
  .el-dialog__footer {
    justify-content: flex-end !important;
  }
}
</style>