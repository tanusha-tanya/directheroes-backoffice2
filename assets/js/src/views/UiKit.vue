<template>
  <div class="uikit">
    <div class="uikit__header">
      <h2>UI Kit</h2>
    </div>
    <div class="uikit__body">
      <div class="uikit-item uikit-item__buttons">
        <div class="uikit-item__header" @click="kit.buttons = !kit.buttons">
          <h3>Buttons</h3>
          <i class="el-icon-arrow-down el-icon--right" :class="{'uikit__rotated': kit.buttons}"></i>
        </div>
        <div
          class="uikit-item__collapsable"
          :class="{ 'uikit-item__collapsable_active': kit.buttons }"
        >
          <div class="buttons buttons__primary">
            <dh-button>Primary</dh-button>
            <dh-button :loading="true">loading</dh-button>
            <dh-button :loading="true" :disabled="true">Primary</dh-button>
            <dh-button size="small">Small</dh-button>
            <dh-button size="small" :loading="true">Small loading</dh-button>
          </div>
          <div class="buttons buttons__reset">
            <dh-button type="reset">Reset</dh-button>
            <dh-button type="reset" :loading="true">loading</dh-button>
            <dh-button type="reset" :loading="true" :disabled="true">Reset</dh-button>
            <dh-button type="reset" size="small">Small</dh-button>
            <dh-button type="reset" size="small" :loading="true">Small loading</dh-button>
          </div>
          <div class="buttons outline">
            <dh-button type="outline">Outline</dh-button>
            <dh-button type="outline" :loading="true">loading</dh-button>
            <dh-button type="outline" :loading="true" :disabled="true">Outline</dh-button>
            <dh-button type="outline" size="small">Small</dh-button>
            <dh-button type="outline" size="small" :loading="true">Small loading</dh-button>
          </div>
          <div class="buttons danger">
            <dh-button type="danger">Danger</dh-button>
            <dh-button type="danger" :loading="true">loading</dh-button>
            <dh-button type="danger" :loading="true" :disabled="true">Danger</dh-button>
            <dh-button type="danger" size="small">Small</dh-button>
            <dh-button type="danger" size="small" :loading="true">Small loading</dh-button>
          </div>
            <div class="buttons text">
            <dh-button type="text">Text</dh-button>
            <dh-button type="text" :loading="true">loading</dh-button>
            <dh-button type="text" :loading="true" :disabled="true">Text</dh-button>
            <dh-button type="text" size="small">Small</dh-button>
            <dh-button type="text" size="small" :loading="true">Small loading</dh-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      kit: {
        buttons: true
      }
    };
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
  }

  .uikit-item__buttons {
    .buttons {
      margin: 0 10px 10px 0;
    }
  }
}
</style>