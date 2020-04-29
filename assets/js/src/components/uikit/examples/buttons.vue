<template>
  <div class="uikit-item uikit-item__buttons">
    <div class="uikit-item__header" @click="visible = !visible">
      <h3>Buttons</h3>
      <i class="el-icon-arrow-down el-icon--right" :class="{'uikit__rotated': visible}"></i>
    </div>
    <div
      class="uikit-item__collapsable buttons"
      :class="{ 'uikit-item__collapsable_active': visible }"
    >
      <div class="uikit-items">
        <dh-button>Primary</dh-button>
        <dh-button :loading="true">loading</dh-button>
        <dh-button :loading="true" :disabled="true">Primary</dh-button>
        <dh-button size="small">Small</dh-button>
        <dh-button size="small" :loading="true">Small loading</dh-button>
      </div>
      <div class="uikit-items">
        <dh-button type="reset">Reset</dh-button>
        <dh-button type="reset" :loading="true">loading</dh-button>
        <dh-button type="reset" :loading="true" :disabled="true">Reset</dh-button>
        <dh-button type="reset" size="small">Small</dh-button>
        <dh-button type="reset" size="small" :loading="true">Small loading</dh-button>
      </div>
      <div class="uikit-items">
        <dh-button type="outline">Outline</dh-button>
        <dh-button type="outline" :loading="true">loading</dh-button>
        <dh-button type="outline" :loading="true" :disabled="true">Outline</dh-button>
        <dh-button type="outline" size="small">Small</dh-button>
        <dh-button type="outline" size="small" :loading="true">Small loading</dh-button>
      </div>
      <div class="uikit-items">
        <dh-button type="danger">Danger</dh-button>
        <dh-button type="danger" :loading="true">loading</dh-button>
        <dh-button type="danger" :loading="true" :disabled="true">Danger</dh-button>
        <dh-button type="danger" size="small">Small</dh-button>
        <dh-button type="danger" size="small" :loading="true">Small loading</dh-button>
      </div>
      <div class="uikit-items">
        <dh-button type="text">Text</dh-button>
        <dh-button type="text" :loading="true">loading</dh-button>
        <dh-button type="text" :loading="true" :disabled="true">Text</dh-button>
        <dh-button type="text" size="small">Small</dh-button>
        <dh-button type="text" size="small" :loading="true">Small loading</dh-button>
      </div>
      <div class="uikit-items">
        <dh-button @click="loading = !loading">{{ loading ? 'Stop' : 'Start' }} loading</dh-button>
        <dh-button type="outline" :loading="loading">Outline</dh-button>
        <dh-button type="text" :loading="loading">Text</dh-button>
        <dh-button size="small" type="reset" :loading="loading">Small</dh-button>
        <dh-button size="small" type="danger" :loading="loading">Small loading</dh-button>
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
      loading: false
    };
  },

  mounted() {
    this.visible = this.active;
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

<style scoped>
</style>