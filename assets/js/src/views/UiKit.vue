<template>
  <div class="uikit">
    <div class="uikit__header">
      <h2>UI Kit</h2>
    </div>
    <div class="uikit__body">
      <ui-kit-buttons :active="false"/>
      <ui-kit-inputs :active="true" />
    </div>
  </div>
</template>

<script>
import UiKitButtons from "../components/uikit/examples/buttons";
import UiKitInputs from "../components/uikit/examples/inputs";

export default {
  components: {
    UiKitButtons,
    UiKitInputs
  }
};
</script>

<style lang="scss">
.uikit {
  height: 100%;
  background-color: #fff;

  .el-icon-arrow-down {
    font-weight: 600;

    &.uikit__rotated {
      transform: rotate(180deg);
    }
  }

  .uikit-item__collapsable {
    display: none;
  }

  .uikit-item__collapsable_active {
    display: block;
  }

  .uikit__header {
    padding: 40px 40px 20px;
  }

  .uikit__body {
    display: flex;
    flex-direction: column;
    padding: 0 40px 0;
  }

  .uikit-item {
    margin-bottom: 10px;

    .uikit-item__header {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }

    .uikit-items {
      margin: 0 10px 10px 0;
    }
  }
}
</style>