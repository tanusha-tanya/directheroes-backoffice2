<template>
  <el-button
    class="dh-button"
    type="button"
    :disabled="disabled"
    :class="[
      typeClass,
      sizeClass,
      {
        'dh-button--disabled': disabled,
        'dh-button--loading': !disabled && loading
      }
    ]"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: "dh-button",

  props: ["type", "size", "disabled", "loading"],

  computed: {
    typeClass() {
      const { type } = this;

      return type && `dh-button--${ type }`
    },

    sizeClass() {
      const { size } = this;

      return size && `dh-button--${ size }`
    }
  }
};
</script>

<style lang="scss">
$button-text-size: $font-size-base;

$primaryTextColor: $white;
$plainTextColor: $primary;
$disabledTextColor: $secondaryDark2;

$primaryBG: $primary;
$primaryBGHover: $primaryHover;
$primaryBGPressed: $primaryPressed;
$primaryBGDisabled: $background2;

$resetBG: $background1;
$resetBGHover: $background2;
$resetHoverText: $primaryHover;
$resetBGPressed: $outline;
$resetPressedText: $primaryPressed;
$resetBGDisabled: $background2;

$outlineBG: $white;
$outlineBGHover: $outlineBG;
$outlineBGPressed: $outlineBG;
$outlineBGBorder: $primary;
$outlineText: $primary;
$outlineBGBorderHover: $primaryHover;
$outlineHoverText: $primaryHover;
$outlineBGBorderPressed: $primaryPressed;
$outlinePressedText: $primaryPressed;

$dangerBG: $secondary3;
$dangerBGHover: $secondary3Hover;
$dangerBGPressed: $secondary3Pressed;
$dangerBGBorderHover: $secondary3Hover;
$dangerBGBorderPressed: $secondary3Pressed;
$dangerHoverText: $white;
$dangerPressedText: $white;

@mixin button-variant(
  $BGcolor-hover,
  $BGcolor-pressed,
  $textColor-hover: $primaryTextColor,
  $textColor-pressed: $primaryTextColor,
  $BGborder-hover: $BGcolor-hover,
  $BGborder-pressed: $BGcolor-pressed
) {
  &:hover {
    background-color: $BGcolor-hover;
    border-color: $BGborder-hover;
    color: $textColor-hover;
  }

  &:active {
    background-color: $BGcolor-pressed;
    border-color: $BGborder-pressed;
    color: $textColor-pressed;
  }

  &.dh-button--disabled,
  &.dh-disabled { // legacy, will be removed later
    background-color: $primaryBGDisabled;
    border: 1px solid $primaryBGDisabled;
    border-radius: 4px;
    opacity: 0.4;
    color: $disabledTextColor;
    pointer-events: none;
  }
}

@mixin button-base-behaviour($BGcolor, $BGborder-color, $textColor) {
  background-color: $BGcolor;
  border: 1px solid $BGborder-color;
  color: $textColor;
  cursor: pointer;

  &:focus {
    background-color: $BGcolor;
    border-color: $BGborder-color;
    color: $textColor;
  }
}

button.dh-button {
  font: 500 $button-text-size Rubik;
  line-height: 17px;
  height: 46px;
  min-width: 200px;
  padding: 15px 15px 14px;
  text-transform: uppercase;
  border-radius: 4px;
  outline: none;

  @include button-base-behaviour($primaryBG, $primaryBG, $primaryTextColor);
  @include button-variant($primaryBGHover, $primaryBGPressed);

  &.dh-button--loading,
  &.dh-loading { // legacy, will be removed later
    color: transparent;
    position: relative;
    pointer-events: none;

    &:before {
      content: "";
      display: block;
      position: absolute;
      top: calc(50% - 10px);
      left: calc(50% - 10px);
      width: 15px;
      height: 15px;
      border-radius: 100%;
      border: 3px solid $sectionBG;
      border-bottom-color: transparent;
      animation: rotation 0.8s infinite linear;
    }
  }

  &.dh-button--small,
  &.dh-small { // legacy, will be removed later
    min-width: 80px;
    height: auto;
    padding: 5px 15px;

    &.dh-button--loading:before,
    &.dh-loading:before {
      width: 5px;
      height: 5px;
      top: calc(50% - 5px);
      left: calc(50% - 5px);
    }
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.dh-button.dh-button--reset,
.dh-button.dh-reset-button { // legacy, will be removed later
  @include button-base-behaviour($resetBG, $resetBG, $plainTextColor);
  @include button-variant(
    $resetBGHover,
    $resetBGPressed,
    $resetHoverText,
    $resetPressedText
  );

  &.dh-button--loading,
  &.dh-loading {
    &:before {
      border-color: $outlinePressedText;
      border-bottom-color: transparent;
    }
  }
}

.dh-button.dh-button--text {
  @include button-base-behaviour(transparent, transparent, $outlineText);
  @include button-variant(
    transparent,
    $outlineBG,
    $outlineHoverText,
    $outlinePressedText,
    transparent,
    transparent
  );

  &.dh-button--disabled {
    background-color: transparent;
    border: 1px solid transparent;
  }

  &.dh-button--loading,
  &.dh-loading {
    &:before {
      border-color: $outlinePressedText;
      border-bottom-color: transparent;
    }
  }
}

.dh-button.dh-button--outline {
  @include button-base-behaviour($outlineBG, $outlineBGBorder, $outlineText);
  @include button-variant(
    $outlineBGHover,
    $outlineBGPressed,
    $outlineHoverText,
    $outlinePressedText,
    $outlineBGBorderHover,
    $outlineBGBorderPressed
  );

  &.dh-button--disabled {
    background-color: $outlineBG;
    border: 1px solid $outline;
  }

  &.dh-button--loading,
  &.dh-loading {
    &:before {
      border-color: $outlinePressedText;
      border-bottom-color: transparent;
    }
  }
}

.dh-button.dh-button--danger,
.dh-button.dh-danger-button { // legacy, will be removed later
  @include button-base-behaviour($dangerBG, $dangerBG, $primaryTextColor);
  @include button-variant(
    $dangerBGHover,
    $dangerBGPressed,
    $dangerHoverText,
    $dangerPressedText,
    $dangerBGBorderHover,
    $dangerBGBorderPressed
  );
}
</style>
