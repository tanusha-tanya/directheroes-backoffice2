<template>
  <div
    class="dh-checkbox"
    :class="[
      typeClass,
      {
        'dh-checkbox--disabled': disabled
      }
    ]"
  >
    <template v-if="type == 'toggle'">
      <span class="dh-checkbox__title">
        <slot></slot>
      </span>
      <el-switch v-model="checked" :disabled="disabled" @change="onChange" />
    </template>
    <template v-else>
      <el-checkbox v-model="checked" :disabled="disabled" @change="onChange">
        <slot></slot>
      </el-checkbox>
    </template>
  </div>
</template>

<script>
export default {
  props: ["value", "type", "disabled"],

  computed: {
    checked: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      }
    },

    typeClass() {
      const { type } = this;

      return type &&  `dh-checkbox--${type}`;
    }
  },

  methods: {
    onChange(value) {
      this.$emit("change", value);
    }
  }
};
</script>

<style lang="scss">
$checkbox-text-size: $font-size-base;

$checkbox-background-color: $outline;
$checkbox-background-color-disabled: $background1;
$checkbox-background-color-unchecked: $white;
$checkbox-background-color-checked: $primary;
$checkbox-border-color-checked: $secondaryDark2;
$checkbox-border-color-unchecked: $background1;
$checkbox-border-color-hover: $primary;
$checkbox-triangle: 2px solid $white;
$checkbox-text-color: $primaryDark;
$checkbox-text-color-disabled: $secondaryDark2;

$checkbox-radio-background-color-unchecked: $background1;
$checkbox-radio-border-color-unchecked: $outline;
$checkbox-radio-pin-color-unchecked: $secondaryDark2;
$checkbox-radio-background-color-checked: $primary;
$checkbox-radio-border-color-checked: $primary;
$checkbox-radio-pin-color-checked: $white;
$checkbox-radio-border-color-disabled-checked: $background1;
$checkbox-radio-background-color-disabled-checked: $background2;
$checkbox-radio-background-color-disabled-unchecked: $white;
$checkbox-radio-border-color-disabled-unchecked: $background1;
$checkbox-radio-pin-color-disabled-checked: $secondaryDark2;

.dh-checkbox {
  &.dh-checkbox--toggle {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;

    .el-switch {
      .el-switch__core {
        background-color: $checkbox-radio-background-color-unchecked;
        border: 1px solid $checkbox-radio-border-color-unchecked;

        &:after {
          background-color: $checkbox-radio-pin-color-unchecked;
        }
      }

      &.is-checked {
        .el-switch__core {
          background-color: $checkbox-radio-background-color-checked;
          border: 1px solid $checkbox-radio-border-color-checked;

          &:after {
            background-color: $checkbox-radio-pin-color-checked;
          }
        }
      }
    }

    &.dh-checkbox--disabled {
      .dh-checkbox__title {
        color: $checkbox-text-color-disabled;
        opacity: 0.4;
      }

      .el-switch {
        opacity: 1;

        .el-switch__core {
          background-color: $checkbox-radio-background-color-disabled-unchecked;
          border: 1px solid $checkbox-radio-border-color-disabled-unchecked;

          &:after {
            opacity: 0.4;
            background-color: $checkbox-radio-pin-color-disabled-checked;
          }
        }

        &.is-checked {
          .el-switch__core {
            background-color: $checkbox-radio-background-color-disabled-checked;
            border: 1px solid $checkbox-radio-border-color-disabled-checked;

            &:after {
              opacity: 0.4;
              background-color: $checkbox-radio-pin-color-disabled-checked;
            }
          }
        }
      }
    }

    .dh-checkbox__title {
      padding-right: 10px;
      color: $checkbox-text-color;
      font-size: $checkbox-text-size;
      font-family: Rubik;
      font-style: normal;
      font-weight: normal;
    }
  }

  &.dh-checkbox--radio .el-checkbox .el-checkbox__input {
    .el-checkbox__inner {
      border-radius: 50%;
      position: relative;
      box-sizing: border-box;

      &:after {
        content: "";
        background-color: $checkbox-background-color-unchecked;
        border-radius: 50%;
        display: block;
        position: absolute;
        height: 8px;
        width: 8px;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%) scale(1);
        margin: auto;
        border: unset;
      }
    }

    &.is-disabled {
      .el-checkbox__inner {
        &:after {
          background-color: $checkbox-border-color-checked;
          opacity: 0.4;
        }
      }
    }
  }

  .el-checkbox .el-checkbox__input {
    height: 20px;
    width: 20px;

    & + .el-checkbox__label {
      color: $checkbox-text-color;
      font-family: Rubik;
      font-style: normal;
      font-weight: normal;
    }

    &.is-indeterminate,
    &.is-checked {
      .el-checkbox__inner {
        background-color: $checkbox-background-color-checked;
        border-color: $checkbox-background-color-checked;
      }
    }

    &.is-focus .el-checkbox__inner {
      border-color: $checkbox-border-color-hover;
    }

    .el-checkbox__inner {
      background-color: $checkbox-background-color-unchecked;
      border: 2px solid $checkbox-border-color-checked;
      border-radius: 2px;
      width: 20px;
      height: 20px;

      &:focus {
        background-color: $checkbox-background-color;
        border-color: $checkbox-border-color-checked;
      }

      &:after {
        left: 6px;
        top: 3px;
        border-right: $checkbox-triangle;
        border-bottom: $checkbox-triangle;
      }

      &:hover {
        border-color: $checkbox-border-color-hover;
      }
    }

    &.is-disabled {
      & + .el-checkbox__label {
        color: $checkbox-text-color-disabled;
        opacity: 0.4;
      }

      .el-checkbox__inner {
        background-color: $checkbox-background-color-unchecked;
        border-color: $checkbox-border-color-unchecked;
      }

      &.is-checked .el-checkbox__inner {
        background-color: $checkbox-background-color-disabled;
        border-color: $checkbox-background-color-disabled;

        &:hover {
          border-color: $checkbox-background-color-disabled;
        }
      }
    }
  }
}
</style>
