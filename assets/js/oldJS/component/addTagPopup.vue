<template>
  <el-popover popper-class="add-tag-popup" placement="right" v-model="isShow" trigger="click" v-if="!existingLink">
    <template slot="reference">
      <span class="add-step-button">
        <slot></slot>
      </span>
    </template>
     <tariff-wrapper
      class="action-item"
      :is-enabled="isAddTagInTariff"
      @click.native="addNewStep(addTagElement.template)">
      {{addTagElement.title}}
    </tariff-wrapper>
    <add-step-popup class="action-item" :builder="builder" :link-element="linkElement" :available-list="availableList" @select="selectHandler">
      <span>Skip Add tag</span>
    </add-step-popup>
  </el-popover>
  <existing-step-popup @find-step="goToStep" @unbind-step="removeLinker" v-else-if="existingLink && existingLink.displaySettings">
    <div class="existing-step-element">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        viewBox="0 0 192.689 192.689" style="enable-background:new 0 0 192.689 192.689;" xml:space="preserve">
        <path d="M188.527,87.755l-83.009-84.2c-4.692-4.74-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l74.54,75.61
          l-74.54,75.61c-4.704,4.74-4.704,12.439,0,17.179c4.704,4.74,12.319,4.74,17.011,0l82.997-84.2
          C193.05,100.375,193.062,92.327,188.527,87.755z" fill="currentColor"/>
        <path d="M104.315,87.755l-82.997-84.2c-4.704-4.74-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l74.528,75.61
          l-74.54,75.61c-4.704,4.74-4.704,12.439,0,17.179s12.319,4.74,17.011,0l82.997-84.2C108.838,100.375,108.85,92.327,104.315,87.755
          z" fill="currentColor"/>
      </svg>
    </div>
  </existing-step-popup>
</template>

<script>
import addStepPopup from './addStepPopup';
import actions from '../elements/actions';
import existingStepPopup from './existingStepPopup';
import TariffWrapper from '../../src/components/dh-tariff-wrapper';

export default {
  data() {
    return {
      isShow: false,
      actions,
    }
  },

  components: {
    addStepPopup,
    existingStepPopup,
    TariffWrapper
  },

  props: ['availableList', 'linkElement', 'builder', 'existingLink'],

  computed: {
    addTagElement() {
      const { actions } = this;

      return actions.find(action => action.template.body.action === 'addCategory')
    },

    isAddTagInTariff() {
      const { getTariffParameter } = this;
      const addTagTariff = getTariffParameter('subscriber_categories')

      return addTagTariff && addTagTariff.enabled
    },
  },

  methods: {
    addNewStep(element) {
      const { builder, linkElement } = this;

      this.$emit('select', element);
      this.isShow = false;

      if (!linkElement) return;

      builder.addStep(linkElement,  JSON.parse(JSON.stringify(element)));
    },

    selectHandler(element) {
      this.$emit('select', element);
      this.isShow = false;
    },

    goToStep() {
      const { existingLink, builder } = this;

      builder.findEntryStep(existingLink.target, true)
    },

    removeLinker() {
      const { builder, existingLink } = this;
      const { subArrows } = builder;
      const arrowInfo = subArrows.find(arrow => arrow.child === existingLink.target && arrow.linkElement === existingLink)

      builder.deleteLink({ arrowInfo })
    }
  },
}
</script>

<style lang="scss">
.add-tag-popup {
  padding: 0;
  border: 1px solid #CFCFCF;

  .action-item {
    padding: 10px;
    display: block;
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
