<template>
  <label class="dh-input-wrapper">
    <span class="dh-input__header" v-if="label">{{ label }}</span>
    <el-input
      class="dh-input"
      :class="[
        {
          'dh-input--error': !!error,
          'dh-input--disabled': disabled,
          'dh-input--readonly': readonly
        }
      ]"
      v-model="input"
      :autofocus="autofocus"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :type="type || 'text'"
      :maxlength="maxlength"
      @change="$emit('change', $event)"
      @input="$emit('input', $event)"
    >
      <template v-slot:prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-slot:prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-slot:suffix>
        <slot name="suffix"></slot>
      </template>
    </el-input>
    <div class="dh-input__footer dh-input-error">
      <span class="dh-input-error__wrapper" v-if="error">
        <span class="dh-input-error__icon"><warning /></span>
        <span class="dh-input-error__text" v-html="error"></span>
      </span>
    </div>
  </label>
</template>

<script>
import warning from '../../assets/warning.svg'

export default {
  props: ['type', 'value', 'label', 'error', 'placeholder', 'autofocus', 'disabled', 'readonly', 'autocomplete', 'maxlength'],

  components: {
    warning
  },

  computed: {
    input: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style lang="scss">
$input-text-size: $font-size-base;
$input-error-text-size: $font-size-small;

$label-color: $secondaryDark1;
$text-color-disabled: $secondaryDark2;
$input-placeholder-color: $secondaryDark2;
$input-border-color: $outline;
$input-border-color-focus: $secondaryDark2;
$input-background: $white;
$input-background-disabled: $background2;
$input-border-color-error: $secondary3;
$input-error-color: $secondary3;

$input-error-icon-size: 14px;

.dh-input-wrapper {
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: $input-text-size;
  line-height: 17px;

  .dh-input__header {
    display: block;
    color: $label-color;
    min-height: 16px;
    margin-bottom: 6px;
    @include text-ellipsis;
  }

  .dh-input__footer {
    font-size: $input-error-text-size;
    line-height: 14px;
    min-height: 14px;
    margin-top: 4px;
    color: $input-error-color;
    white-space: normal;
  }

  .dh-input-error__wrapper {
    display: flex;
    align-items: flex-start;

    .dh-input-error__icon {
      width: $input-error-icon-size;
      max-height: $input-error-icon-size;
    }

    .dh-input-error__text {
      padding-left: 3px;
    }
  }

  .dh-input {
    input {
      background: $input-background;
      border: 1px solid $input-border-color;
      box-sizing: border-box;
      border-radius: 4px;
      height: 46px;

      &:focus {
        border-color: $input-border-color-focus;
      }

      &::placeholder {
        color: $input-placeholder-color;
        opacity: 0.6;
      }
    }

    &.dh-input--error input {
      border-color: $input-border-color-error;
    }

    &.dh-input--disabled input {
      color: $text-color-disabled;
      pointer-events: none;
      background-color: $input-background-disabled;
    }

    &.dh-input--readonly input {
      pointer-events: none;
    }

    .el-input__suffix {
      right: 14px;

      .el-input__suffix-inner {
        height: 100%;
        display: flex;
        align-self: center;
      }

      svg {
        width: 18px;
      }
    }

    .el-input-group__prepend {
      padding: 0 10px;
    }

    .el-input__prefix {
      left: 14px;
      color: $label-color;

      svg {
        width: 18px;
      }
    }

    &.el-input--prefix .el-input__inner {
      padding-left: 40px;
    }
  }
}
</style>