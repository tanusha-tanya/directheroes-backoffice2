<template>
  <el-popover popper-class="add-step-popup" placement="right" v-model="isShow" v-if="!existingLink">
    <div class="add-step-button" slot="reference">
      <slot></slot>
    </div>
    <div class="types-of-elements">
      <div class="type-of-element">
        <add-message-popup :available-list="availableList" @on-select="selectElement" >
          <span class="message-elements">Messages</span>
        </add-message-popup>
      </div>
      <div class="type-of-element">
        <add-trigger-popup :available-list="availableList" @on-select="selectElement" >
          <span class="trigger-elements">Triggers</span>
        </add-trigger-popup>
      </div>
      <div class="type-of-element">
        <add-action-popup :available-list="availableList" @on-select="selectElement">
          <span class="action-elements">Actions</span>
        </add-action-popup>
      </div>
      <div class="type-of-element">
        <add-condition-popup :available-list="availableList" @on-select="selectElement">
          <span class="condition-elements">Conditions</span>
        </add-condition-popup>
      </div>
      <div class="type-of-element">
        <span class="exist-step-connection" v-if="(availableList || []).includes('existingStep')" @click="selectElement(existingStepObject)">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 116.936 116.936" style="enable-background:new 0 0 116.936 116.936;"
            xml:space="preserve">
              <path d="M23.144,102.317c-4.037,0-7.308,3.271-7.308,7.31c0,4.037,3.271,7.309,7.308,7.309h70.647
                c4.037,0,7.309-3.271,7.309-7.309V60.903V7.309C101.1,3.272,97.829,0,93.791,0H23.144c-4.037,0-7.308,3.271-7.308,7.309
                c0,4.036,3.271,7.309,7.308,7.309h63.338v38.978h-56.03c-4.036,0-7.308,3.271-7.308,7.308s3.272,7.309,7.308,7.309h56.03v34.105
                L23.144,102.317L23.144,102.317z" fill="currentColor"/>
          </svg>
          Existing step
        </span>
      </div>
    </div>
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
import addMessagePopup from './addMessagePopup';
import addTriggerPopup from './addTriggerPopup';
import addActionPopup from './addActionPopup';
import addConditionPopup from './addConditionPopup';
import existingStepPopup from './existingStepPopup';

export default {
  data() {
    return {
      isShow: false,
      existingStepObject: {
        type: "existingStep"
      }
    }
  },

  props:['availableList', 'builder', 'linkElement', 'existingLink'],

  components: {
    addTriggerPopup,
    addActionPopup,
    addMessagePopup,
    addConditionPopup,
    existingStepPopup
  },

  methods: {
    selectElement(element) {
      const { builder, linkElement } = this;

      this.$emit('select', element);
      this.isShow = false;

      if (!linkElement) return;

      builder.addStep(linkElement,  JSON.parse(JSON.stringify(element)));
    },

    goToStep() {
      const { existingLink, builder } = this;

      console.log(builder);


      builder.findEntryStep(existingLink.target, true)
    },

    removeLinker() {
      const { builder, existingLink } = this;
      const { subArrows } = builder;
      const arrowInfo = subArrows.find(arrow => arrow.child === existingLink.target && arrow.linkElement === existingLink)

      builder.deleteLink({ arrowInfo })
    }
  }
}
</script>

<style lang="scss">

</style>
