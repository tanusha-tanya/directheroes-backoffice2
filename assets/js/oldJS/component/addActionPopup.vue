<template>
<el-popover popper-class="add-action-popup" :disabled="!hasAvailableAction" placement="right" v-model="isShow" trigger="hover">
  <template slot="reference">
    <span :class="{'add-step-item': true, 'add-disabled-popup': !hasAvailableAction}">
      <slot></slot>
    </span>
  </template>
  <template v-for="action in actions">
    <tariff-wrapper
      :class="{'action-item':true, 'action-disabled': availableList && !availableList.includes(actionType(action))}"
      :is-enabled="isEnabledByTariff(actionType(action))"
      :key="action.title"
      @click.native="selectAction(action)">
      {{action.title}}
    </tariff-wrapper>
  </template>
</el-popover>
</template>

<script>
import actions from '../elements/actions';
import TariffWrapper from '../../src/components/dh-tariff-wrapper';

export default {
  data() {
    return {
      isShow: false,
      actions,
      tariffsAction: ['addCategory', 'zapier']
    }
  },

  props: ['availableList'],

  components: {
    TariffWrapper
  },

  computed: {
    hasAvailableAction() {
      const { availableList, actions, actionType } = this;

      if (!availableList) return true;

      return actions.some(action => {
        return availableList.includes(actionType(action))
      })
    },

    isAddTagInTariff() {
      const { getTariffParameter } = this;
      const addTagTariff = getTariffParameter('subscriber_categories')

      return addTagTariff && addTagTariff.enabled
    },

    isAddTagInTariff() {
      const { getTariffParameter } = this;
      const addTagTariff = getTariffParameter('subscriber_categories')

      return addTagTariff && addTagTariff.enabled
    },

    isZapierInTariff() {
      const { getTariffParameter } = this;
      const zapierTariff = getTariffParameter('flow_zapier_element')

      return zapierTariff && zapierTariff.enabled
    }
  },

  methods: {
    selectAction(action) {
      this.$emit('on-select', JSON.parse(JSON.stringify(action.template)));
      this.isShow = false;
    },

    actionType(element) {
      const { template } = element;

      return template.displaySettings.type || template.body.action;
    },

    isEnabledByTariff(actionType) {
      const { isAddTagInTariff, isZapierInTariff } = this;

      switch (actionType) {
        case 'addCategory':
          return isAddTagInTariff
          break;
        case 'zapier':
          return isZapierInTariff
          break;
        default:
          return true
          break;
      }
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

    &.action-disabled {
      opacity: .3;
      pointer-events: none;
    }
  }
}
</style>
