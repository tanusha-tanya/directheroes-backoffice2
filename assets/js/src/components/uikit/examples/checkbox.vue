<template>
  <div class="uikit-item uikit-item__checkbox">
    <div class="uikit-item__header" @click="visible = !visible">
      <h3>Checkboxes</h3>
      <i class="el-icon-arrow-down el-icon--right" :class="{'uikit__rotated': visible}"></i>
    </div>
    <div class="uikit-item__collapsable" :class="{ 'uikit-item__collapsable_active': visible }">
      <div class="uikit-items checkbox">
        <dh-checkbox :value="true">Default checked</dh-checkbox>
        <dh-checkbox>Default</dh-checkbox>
        <dh-checkbox :disabled="true" :value="true">Disabled checked</dh-checkbox>
        <dh-checkbox :disabled="true" :value="false">Disabled unchecked</dh-checkbox>
      </div>
      <div class="uikit-items checkbox">
        <dh-checkbox type="radio" :value="true">Circle checked</dh-checkbox>
        <dh-checkbox type="radio">Circle</dh-checkbox>
        <dh-checkbox type="radio" :disabled="true" :value="true">Disabled checked</dh-checkbox>
        <dh-checkbox type="radio" :disabled="true" :value="false">Disabled unchecked</dh-checkbox>
      </div>
      <div class="uikit-items checkbox">
        <dh-checkbox type="toggle" :value="true">Toggle checked</dh-checkbox>
        <dh-checkbox type="toggle" v-model="checkboxValue">Toggle</dh-checkbox>
        <dh-checkbox type="toggle" :disabled="true" :value="true">Disabled checked</dh-checkbox>
        <dh-checkbox type="toggle" :disabled="true" :value="false">Disabled unchecked</dh-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["active"],

  data: () => {
    return {
      visible: false,
      checkboxValue: false
    };
  },

  watch: {
    active: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.visible = newVal;
      }
    }
  }
};
</script>

<style lang="scss">
.uikit-items.checkbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .dh-checkbox {
    margin: 10px 10px 10px 0;
    width: 200px;
  }
}
</style>