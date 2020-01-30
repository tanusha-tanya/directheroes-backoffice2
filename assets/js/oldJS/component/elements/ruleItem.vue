<template>
  <div class="rule-item" :ref="element.id">
    <element-warning :element="rule" :is-entry="isEntry"></element-warning>
    <div class="rule-item-title">{{ ruleTitles[ruleType] }} <span v-if="ruleType === 'storyMention'">@{{currentAccount.login}}</span></div>
    <template v-if="ruleType == 'list'">
      <keywords v-model="rule.condition.value"></keywords>
    </template>
    <template v-else-if="ruleType == 'postShare'">
      <el-input
        size="small"
        placeholder="Leave empty to target any URL"
        v-model="rule.onMatch.elements[0].condition.value"
      ></el-input>
    </template>
    <template v-else-if="['storyMention'].includes(ruleType)">
      <keywords class="rule-item-story-mention" v-model="rule.onMatch.elements[0].condition.value" placeholder="Click to add hashtags" @change="checkHashTags"></keywords>
    </template>
    <template v-else-if="['storyShare'].includes(ruleType)">
      <keywords v-model="rule.onMatch.elements[0].condition.value" ></keywords>
    </template>
    <add-tag-popup
      :available-list="availableList"
      @add-step="$emit('create-step', $event)"
      v-if="!hasOnMatch"
    ></add-tag-popup>
    <add-mid-step-popup
      :available-list="['addCategory', 'sendText', 'sendMedia']"
      @add-step="addMidStep($event)"
      v-else
    ></add-mid-step-popup>
    <div
      class="rule-delete-button"
      @click="$emit('delete-trigger', element)"
      v-if="elements.length > (isEntry ? 2 : 1) && !hasOnMatch"
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
import ObjectId from '../../utils/ObjectId';
import addTagPopup from '../addTagPopup';
import addMidStepPopup from '../addMidStep';
import elementWarning from '../elementWarning'
import keywords from '../keywords';
import elementsPermissions from '../../elements/permissions'


export default {


  props:['element', 'isEntry', 'elements'],

  components: {
    keywords,
    addTagPopup,
    elementWarning,
    addMidStepPopup
  },

  computed: {
    availableList() {
      const { elements } = this.dhAccount.flowBuilderSettings;

      return elementsPermissions.fromTrigger.concat(elements);
    },

    hasOnMatch() {
      const matchElement = utils.getOnMatchElement(this.rule);

      return matchElement && matchElement.onMatch;
    },

    ruleType() {
      const { value, entity, operand } = this.rule.condition;

      if (['postShare', 'adReply', 'storyShare', 'storyMention', 'mediaShare'].includes(value)) {
        return value;
      } else if (entity === 'message' && operand === 'contains') {
        return 'list'
      }
    },

    ruleTitles() {
      return {
        list: 'Keywords',
        postShare: 'Post Reply',
        adReply: 'Ad Reply',
        storyShare: 'Story Reply',
        storyMention: 'Story Mention',
        mediaShare: 'Media Share'
      }
    },

    rule() {
      const { elements } = this.element;

      return elements.find(element => element.type === 'rule')
    },
  },

  methods: {
    addMidStep(element) {
      const { hasOnMatch } = this;
      const step = {
        id: (new ObjectId).toString(),
        elements: [
          {
            id: (new ObjectId).toString(),
            ...element
          }
        ]
      }

      step.elements.push({
        id: (new ObjectId).toString(),
        type: 'linker',
        target: hasOnMatch.target
      })

      hasOnMatch.target = step.id;

      this.$emit('add-step', step);
    },

    checkHashTags(value) {
      value.forEach((keyword, index) => {
        if(!/^#/.test(keyword)) return;

        value.splice(index, 1, keyword.replace(/^#/, ''))
      })
    }
  }
};
</script>

<style lang="scss">
 .rule-item-title span {
   font-weight: bold;
 }

 .rule-item-story-mention {
   .el-select__tags-text::before {
     content: '#'
   }
 }
</style>