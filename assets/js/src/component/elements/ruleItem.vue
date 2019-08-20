<template>
  <div class="rule-item" :ref="element.id">
    <element-warning :element="rule"></element-warning>
    <div class="rule-item-title">{{ ruleTitles[ruleType] }}</div>
    <template v-if="ruleType == 'list'">
      <keywords v-model="rule.condition.value"></keywords>
    </template>
    <template v-else-if="ruleType == 'postReply'">
      <el-input
        size="small"
        placeholder="Please enter post URL"
        v-model="rule.onMatch.elements[0].condition.value"
      ></el-input>
    </template>
    <add-step-popup
      :available-list="availableList"
      @add-step="$emit('create-step', $event)"
      v-if="!hasOnMatch"
    ></add-step-popup>
    <div
      class="rule-delete-button"
      @click="$emit('delete-trigger', element)"
      v-if="elements.length > 1 && !hasOnMatch"
    >
      <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.018 10L21 18.554 19.48 20l-8.98-8.554L1.518 20 0 18.554 8.98 10 0 1.446 1.518 0 10.5 8.554 19.48 0 21 1.446z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import utils from '../../utils';
import addStepPopup from '../addStepPopup';
import elementWarning from '../elementWarning'
import keywords from '../keywords';
import elementsPermissions from '../../elements/permissions'


export default {
  data() {
    return {
      availableList: elementsPermissions.fromTrigger
    }
  },

  props:['element', 'isEntry', 'elements'],

  components: {
    keywords,
    addStepPopup,
    elementWarning,
  },

  computed: {
    hasOnMatch() {
      const matchElement = utils.getOnMatchElement(this.rule);

      return matchElement && matchElement.onMatch;
    },

    ruleType() {
      const matchElement = utils.getOnMatchElement(this.rule);
      const { value, entity, operand } = matchElement.condition;

      if (['postReply', 'adReply', 'storyReply', 'storyMention', 'mediaShare'].includes(value)) {
        return value;
      } else if (entity === 'message' && operand === 'contains') {
        return 'list'
      }
    },

    ruleTitles() {
      return {
        list: 'Keywords',
        postReply: 'Post Reply',
        adReply: 'Ad Reply',
        storyReply: 'Story Reply',
        storyMention: 'Story Mention',
        mediaShare: 'Media Share'
      }
    },

    rule() {
      const { element } = this;

      if (element.type == 'group') {
        return element.elements.find(element => element.type === 'rule')
      }

      return element
    },
  }
};
</script>

<style lang="scss">
</style>