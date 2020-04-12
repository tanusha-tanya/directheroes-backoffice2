<template>
  <div class="dh-affiliate-card">
    <div class="dh-affiliate-card-header">
      <span class="dh-affiliate-card-header__icon">
        <slot name="icon"></slot>
      </span>
      <div class="dh-affiliate-card-header__body">
        <span class="dh-affiliate-card-header__title">{{ title }}</span>
        <span class="dh-affiliate-card-header__subtitle">{{ subtitle }}</span>
      </div>
    </div>
    <div class="dh-affiliate-card-body">
      <slot name="body"></slot>
    </div>
    <div class="dh-affiliate-card-footer" v-if="hasFooter()">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "subtitle"],

  methods: {
    hasFooter() {
      return this.$slots.footer;
    }
  }
};
</script>

<style lang="scss">
$card-header-icon-size: 53px;
$card-header-background-color: $background1;
$card-header-title-color: $primaryDark;
$card-header-title-font-size: $font-size-heading-h3;
$card-header-subtitle-color: $secondaryDark1;
$card-header-subtitle-font-size: $font-size-base;
$card-header-border-color: $outline;

$card-footer-size: 48px;
$card-footer-background-color: rgba(242, 244, 246, 0.5);

.dh-affiliate-card {
  min-height: 240px;

  .dh-affiliate-card-header {
    display: flex;
    border-bottom: unset;
    padding: 28px 0 0 28px;

    .dh-affiliate-card-header__icon {
      display: block;
      text-align: center;
      min-width: $card-header-icon-size;
      height: $card-header-icon-size;
      background-color: $card-header-background-color;
      border-radius: 50%;
      margin-right: 16px;

      svg {
        width: 24px;
        max-height: 24px;
        position: relative;
        top: 14px;
      }
    }

    .dh-affiliate-card-header__body {
      display: flex;
      flex-direction: column;
      font-family: Rubik;
      font-style: normal;

      .dh-affiliate-card-header__title {
        color: $card-header-title-color;
        font-weight: normal;
        font-size: $card-header-title-font-size;
        line-height: 24px;
      }

      .dh-affiliate-card-header__subtitle {
        color: $card-header-subtitle-color;
        font-size: $card-header-subtitle-font-size;
        line-height: 17px;
        padding-top: 6px;
      }
    }
  }

  .dh-affiliate-card-body {
    padding: 20px 28px 4px 28px;
  }

  .dh-affiliate-card-footer {
    min-height: $card-footer-size;
    background-color: $card-footer-background-color;
    padding: 12px 28px;
  }
}
</style>