<template>
  <div class="uikit">
    <div class="uikit__header">
      <h2>UI Kit</h2>
      <dh-button type="outline" size="small" v-if="hasClosed" @click="toggleItems(true)">expand</dh-button>
      <dh-button type="outline" size="small" v-else @click="toggleItems(false)">collapse</dh-button>
    </div>
    <div class="uikit__body">
      <ui-kit-buttons :active="kit.buttons" />
      <ui-kit-inputs :active="kit.inputs" />
      <ui-kit-checkbox :active="kit.checkbox" />
    </div>
  </div>
</template>

<script>
import UiKitButtons from "../components/uikit/examples/buttons";
import UiKitInputs from "../components/uikit/examples/inputs";
import UiKitCheckbox from "../components/uikit/examples/checkbox";

export default {
  components: {
    UiKitButtons,
    UiKitInputs,
    UiKitCheckbox
  },

  data: () => {
    return {
      kit: {
        buttons: false,
        inputs: false,
        checkbox: true
      }
    };
  },

  computed: {
    hasClosed() {
      return Object.keys(this.kit).some(kitItem => !this.kit[kitItem]);
    }
  },

  methods: {
    toggleItems(status) {
      const { kit } = this;

      Object.keys(kit).forEach(k => {
        kit[k] = status;
      });
    }
  }
};
</script>

<style lang="scss">
.uikit {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  min-height: 100%;

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
    display: inline-flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
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