<template>
  <label class="dh-input-wrapper">
    <span class="dh-input__header">{{ label }}</span>
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
      @change="$emit('change', $event)"
      @input="$emit('input', $event)"
    />
    <div class="dh-input__footer dh-input-error">
      <span class="dh-input-error__wrapper" v-if="error">
        <span class="dh-input-error__icon"><warning /></span>
        <span class="dh-input-error__text">{{ error }}</span>
      </span>
    </div>
  </label>
</template>

<script>
import warning from '../../assets/warning.svg'

export default {
  props: ["value", "label", "error", "placeholder", "autofocus", "disabled", "readonly"],
  
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
      width: 14px;
      max-height: 14px;
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
  }
}
</style>