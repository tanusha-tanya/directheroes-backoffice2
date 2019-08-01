<template>
<el-popover popper-class="add-action-popup" placement="right" v-model="isShow" trigger="hover">
  <template slot="reference">
    <slot></slot>
  </template>
  <div
    class="action-item"
    v-for="action in actions"
    :key="action.title"
    @click="selectAction(action)">
    {{action.title}}
  </div>
</el-popover>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      actions: [
        {
          title: 'Text',
          template: {
            type: 'action',
            body: {
              action: 'sendText',
              text: ''
            }
          }
        },
        // {
        //   title: 'Image',
        //   template: {
        //     type: 'action',
        //     body: {
        //       action: 'sendImage',
        //     }
        //   }
        // }
      ]
    }
  },

  methods: {
    selectAction(action) {
      this.$emit('on-select', action.template);
      this.isShow = false;
    }
  }
}
</script>

<style lang="scss">
.add-action-popup {
  padding: 0;
  border: 1px solid #CFCFCF;

  .action-item {
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: #F8F8F8;
    }
  }
}
</style>
