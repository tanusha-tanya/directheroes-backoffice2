<template>
  <div class="uikit-item uikit-item__inputs">
    <div class="uikit-item__header" @click="visible = !visible">
      <h3>Inputs</h3>
      <i class="el-icon-arrow-down el-icon--right" :class="{'uikit__rotated': visible}"></i>
    </div>
    <div class="uikit-item__collapsable" :class="{ 'uikit-item__collapsable_active': visible }">
      <div class="uikit-items inputs small">
        <dh-input error="Error was catched" v-model="inputValue" :autofocus="true" />
        <dh-input placeholder="hello bro" v-model="inputValue" />
        <dh-input placeholder="hello bro" v-model="inputValue" label="hello world" />
        <dh-input placeholder="hello bro" v-model="inputValue" error="Error description" />
        <dh-input
          placeholder="hello bro"
          v-model="inputValue"
          label="hello worldfasfasfasfasfafsaf"
          error="Error was catched"
        />
        <dh-input
          placeholder="hello bro"
          v-model="inputValue"
          label="hello world"
          :disabled="true"
        />
      </div>
      <div class="uikit-items inputs large">
        <dh-input label="errored input" error="Error was catchedError was catchedError was catchedError was catchedError was catchedError was catched" v-model="inputValue" :autofocus="true" />
        <dh-input placeholder="hello bro" error="Error was catchedError was catchedError was catchedError was catchedError was catchedError was catched"  v-model="inputValue" />
        <dh-input placeholder="hello bro" error="Error was catchedError was catchedError was catchedError was catchedError was catchedError was catched"  v-model="inputValue" label="hello world" />
      </div>
      <div class="uikit-items inputs large">
        <dh-input placeholder="Readonly" v-model="inputValue" label="Readonly input" :readonly="true"/>
        <dh-input placeholder="Readonly" error="something went wrong" v-model="inputValue" label="Readonly input" :readonly="true"/>
        <dh-input placeholder="Readonly" v-model="inputValue" :readonly="true"/>
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
      inputValue: ""
    };
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

<style lang="scss">
.uikit-items.inputs {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &.small {
    .dh-input-wrapper {
      width: 135px;
    }
  }

  &.large {
    .dh-input-wrapper {
      width: 300px;
    }
  }

  > label {
    margin-right: 10px;
  }
}
</style>