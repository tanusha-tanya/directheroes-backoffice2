<template>
  <div class="rule-item" :ref="element.id">
    <element-warning :element="rule" :is-entry="isEntry"></element-warning>
    <div class="rule-item-title">{{ ruleTitles[ruleType] }} <span v-if="ruleType === 'storyMention'">@{{account.login}}</span></div>
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
      :available-list="availableList(element)"
      :link-element="element"
      :builder="builder"
      v-if="!hasOnMatch"
    ></add-tag-popup>
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
import elementWarning from '../elementWarning'
import keywords from '../keywords';
import elementsPermissions from '../../elements/permissions'
import { userInputSubscriber } from '../../elements/userInput'


export default {
  props:['element', 'isEntry', 'elements', 'builder'],

  components: {
    keywords,
    addTagPopup,
    elementWarning,
  },

  computed: {
    account() {
      return this.$store.state.currentAccount;
    },

    hasOnMatch() {
      const { builder } = this;
      const matches = builder.getAllMatchElements(this.rule)

      return matches.length && matches[0].onMatch;
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
    checkHashTags(value) {
      value.forEach((keyword, index) => {
        if(!/^#/.test(keyword)) return;

        value.splice(index, 1, keyword.replace(/^#/, ''))
      })
    },

    availableList(element) {
      const { builder, isEntry } = this;

      return builder.availableListByElement(element, null, isEntry);
    },
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