<template>
  <el-button
    class="dh-button"
    :class="[
      type ? 'dh-button--' + type : '',
      size ? 'dh-button--' + size : '',
      {
        'dh-disabled': disabled,
        'dh-loading': !disabled && loading
      }
    ]"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: "dh-button",
  props: ["type", "size", "disabled", "loading"]
};
</script>

<style lang="scss">
$primaryTextColor: $white;
$plainTextColor: $elementActiveColor;
$disabledTextColor: $secondaryDark2;

$primaryBG: $elementActiveColor;
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
$outlineBGBorder: $elementActiveColor;
$outlineText: $elementActiveColor;
$outlineBGBorderHover: $primaryHover;
$outlineHoverText: $primaryHover;
$outlineBGBorderPressed: $primaryPressed;
$outlinePressedText: $primaryPressed;

@mixin button-is-disabled {
  background-color: $primaryBGDisabled;
  border: 1px solid $primaryBGDisabled;
  border-radius: 4px;
  opacity: 0.4;
  color: $disabledTextColor;
}

button.dh-button {
  font: 500 14px Rubik;
  line-height: 17px;
  color: $primaryTextColor;
  background-color: $primaryBG;
  height: 46px;
  min-width: 200px;
  padding: 15px 15px 14px;
  text-transform: uppercase;
  border-radius: 4px;
  outline: none;
  border: 1px solid $primaryBG;

  &:focus,
  &:hover {
    background-color: $primaryBGHover;
    border-color: $primaryBGHover;
    color: $primaryTextColor;
  }

  &:active {
    color: $primaryTextColor;
    background-color: $primaryBGPressed;
    border-color: $primaryBGPressed;
  }

  &.dh-button--small {
    min-width: auto;
    height: auto;
    padding: 5px 15px;

    &.dh-loading {
      &:before {
        width: 5px;
        height: 5px;
        border-radius: 5px;
        top: calc(50% - 6px);
        left: calc(50% - 6px);
      }
    }
  }

  &.dh-disabled {
    @include button-is-disabled;
  }

  &.dh-loading {
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
      border-radius: 15px;
      border: 3px solid $sectionBG;
      border-bottom-color: transparent;
      animation: rotation 0.8s infinite linear;
    }
  }
}

button.dh-button.dh-button--reset {
  border: 1px solid $resetBG;
  background-color: $resetBG;
  color: $plainTextColor;

  &:focus,
  &:hover {
    background-color: $resetBGHover;
    border-color: $resetBGHover;
    color: $resetHoverText;
  }

  &:active {
    background-color: $resetBGPressed;
    color: $resetPressedText;
  }

  &.dh-disabled {
    @include button-is-disabled;
  }

  &.dh-loading {
    &:before {
      border-color: $outlinePressedText;
      border-bottom-color: transparent;
    }
  }
}

button.dh-button.dh-button--text {
  border: unset;
  background-color: transparent;
  color: $outlineText;

  &:focus,
  &:hover {
    background-color: transparent;
    color: $outlineHoverText;
  }

  &:active {
    background-color: $outlineBG;
    border-color: $outlineBGBorderPressed;
    color: $outlinePressedText;
  }

  &.dh-disabled {
    @include button-is-disabled;
    background-color: transparent;
    border: 1px solid transparent;
  }

  &.dh-loading {
    &:before {
      border-color: $outlinePressedText;
      border-bottom-color: transparent;
    }
  }
}

button.dh-button.dh-button--outline {
  border: 1px solid $outlineBGBorder;
  background-color: $outlineBG;
  color: $outlineText;

  &:focus,
  &:hover {
    background-color: $outlineBG;
    border-color: $outlineBGBorderHover;
    color: $outlineHoverText;
  }

  &:active {
    background-color: $outlineBG;
    border-color: $outlineBGBorderPressed;
    color: $outlinePressedText;
  }

  &.dh-disabled {
    @include button-is-disabled;
    background-color: $outlineBG;
    border: 1px solid $outline;
    border-radius: 4px;
  }

  &.dh-loading {
    &:before {
      border-color: $outlinePressedText;
      border-bottom-color: transparent;
    }
  }
}

button.dh-button.dh-button--danger {
  border-color: $failColor;
  background-color: $failColor;

  &.dh-disabled {
    @include button-is-disabled;
  }

  &:hover {
    background-color: #e8498c;
  }
}
</style>