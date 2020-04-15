<template>
  <div class="rule-item" :ref="element.id">
    <element-warning :element="element" :is-entry="isEntry"></element-warning>
    <div class="rule-item-title">{{ ruleTitles[ruleType] }} <span v-if="ruleType === 'storyMention'">@{{currentAccount.login}}</span></div>
    <template v-if="ruleType == 'list'">
      <keywords v-model="rule.condition.value" :is-allow-create="true" placeholder="Click to enter keywords" ></keywords>
    </template>
    <template v-else-if="ruleType == 'postShare'">
      <el-input
        size="small"
        placeholder="Leave empty to target any URL"
        v-model="rule.onMatch.elements[0].condition.value"
      ></el-input>
    </template>
    <template v-else-if="['storyMention'].includes(ruleType)">
      <keywords class="rule-item-story-mention" :is-allow-create="true" v-model="rule.onMatch.elements[0].condition.value" placeholder="Click to add hashtags" @change="checkHashTags"></keywords>
    </template>
    <template v-else-if="['storyShare'].includes(ruleType)">
      <keywords v-model="rule.onMatch.elements[0].condition.value" :is-allow-create="true"></keywords>
    </template>
    <template v-else-if="ruleType == 'user-input'">
      <div class="dh-select">
        <el-select v-model="rule.condition.value" size="small" popper-class="dh-select-popper">
          <el-option v-for="inputType in inputList" :key="inputType.value" :value="inputType.value" :label="inputType.title"></el-option>
        </el-select>
      </div>
    </template>
    <template v-else-if="ruleType == 'noreply'">
      within: <timeout :element="element"></timeout>
    </template>
    <add-tag-popup
      :available-list="availableList(element)"
      :link-element="element"
      :builder="builder"
      :existing-link="hasOnMatch"
    ></add-tag-popup>
    <div
      class="rule-delete-button"
      @click="$emit('delete-trigger', element)"
      v-if="elements.length > 2"
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
import timeout from '../timeout';
import elementsPermissions from '../../elements/permissions'


export default {
  props:['element', 'isEntry', 'elements', 'builder'],

  components: {
    keywords,
    addTagPopup,
    elementWarning,
    timeout
  },

  computed: {
    hasOnMatch() {
      const { builder } = this;
      const matches = builder.getAllMatchElements(this.rule)

      return matches.length && matches[0].onMatch;
    },

    ruleType() {
      const { displaySettings } = this.element;
      const { value, entity, operand } = this.rule.condition;

      if (['postShare', 'adReply', 'storyShare', 'storyMention', 'mediaShare'].includes(value)) {
        return value;
      } else if (['noreply', 'user-input', 'number'].includes(displaySettings.type)) {
        return displaySettings.type
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
        mediaShare: 'Media Share',
        'user-input': 'User Input',
        noreply: 'No reply',
        number: 'Number'
      }
    },

    rule() {
      const { elements } = this.element;

      return elements.find(element => element.type === 'rule')
    },

    inputList() {
      const { userInputMatches } = this.dhAccount.flowBuilderSettings;

      return userInputMatches;
    },

    canHasEmptyKeywords() {
      const { isEntry, $store } = this;
      const { growthTools, triggers } = $store.state.dhAccount.flowBuilderSettings;

      return (isEntry ? growthTools : triggers).messageTypes.includes('anyMessage')
    }
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
  .rule-item {

    .timeout {
      width: 100px;

      .hidden-select {
        width: auto;

        .el-input {
          margin-top: 0;
        }

        input {
          padding: 0 !important;
        }
      }

      input{
        font-weight: 700 !important;
      }
    }

    .dh-select {
      .el-select {
        width: 100%;

        .el-input {
          margin-top: 0;
        }

        .el-input__inner {
          border: 1px solid #DCDFE6;
          background-color: #fff;
          text-transform: none;
        }

        .el-input__icon {
          line-height: 25px;
        }
      }
    }
  }
 .rule-item-title span {
   font-weight: bold;
 }

 .rule-item-story-mention {
   .el-select__tags-text::before {
     content: '#'
   }
 }
</style>