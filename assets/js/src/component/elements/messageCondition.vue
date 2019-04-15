<template>
<div class="message-condition">
  <el-select
    :class="[{'campaign-type': true}, element.value.messageType]"
    v-model="element.value.messageType"
    popper-class="campaign-type-dropdown"
    v-if="!hideSelect"
    >
    <el-option class="ad-reply" label="Ad Reply" value="adReply" v-if="availableTriggers.includes('adReply')">Ad Reply</el-option>
    <el-option class="story" label="Story Reply" value="storyShare" v-if="availableTriggers.includes('storyShare')">Story Reply</el-option>
    <el-option class="story" label="Story Mention" value="storyMention" v-if="availableTriggers.includes('storyMention')">Story Mention</el-option>
    <el-option class="post-share" label="Post Reply" value="postShare" v-if="availableTriggers.includes('postShare')">Post Reply</el-option>
    <el-option class="story" label="Media Share" value="mediaShare" v-if="availableTriggers.includes('mediaShare')">Media Share</el-option>
    <el-option class="story-mention" label="Keyword" value="any" v-if="canHasAny && availableTriggers.includes('any')">Keyword</el-option>
  </el-select>
  <template v-if="['storyMention', 'storyShare', 'any', 'mediaShare'].includes(element.value.messageType)">
    <keywords
      v-model="element.value.keywords"
      :tag-prefix="tagPrefix"
      :tag-name="tagName"
      @set-tag-name="$emit('set-tag-name', $event)"
      >
      <slot></slot>
    </keywords>
  </template>
  <template v-if="['postShare', 'adReply'].includes(element.value.messageType)">
    <input placeholder="Please enter URL" v-model="element.value.link">
    <div class="notice">Leave empty to target any url.</div>
    <keywords v-model="element.value.keywords">
      <slot></slot>
    </keywords>
  </template>
</div>
</template>
<script>
import keywords from "../keywords.vue";

export default {
  props:['element', 'mode', 'hideSelect', 'canHasAny', 'tagName', 'tagPrefix', 'triggers'],

  components: {
    keywords
  },

  computed: {
    availableTriggers() {
      const allTriggers = ['adReply', 'storyShare', 'storyMention', 'postShare', 'mediaShare', 'any']

      return this.triggers || allTriggers;
    }
  }
}
</script>
<style lang="scss">
  .message-condition {
    .campaign-type {
      width: 100%;
      margin-bottom: 7px;

      .el-input__suffix {
        display: none;
      }

      &.storyShare .el-input--suffix:before {
        background-image: url(../../assets/svg/bubble-w.svg);
        height: 11px;
        top: 10px;
      }

      &.storyMention .el-input--suffix:before {
        background-image: url(../../assets/svg/bubble-w.svg);
        height: 11px;
        top: 10px;
      }

      &.mediaShare .el-input--suffix:before {
        background-image: url(../../assets/svg/bubble-w.svg);
        height: 11px;
        top: 10px;
      }

      &.any .el-input--suffix:before {
        background-image: url(../../assets/svg/timer-w.svg);
        height: 13px;
        top: 8px;
      }

      &.postShare .el-input--suffix:before {
        background-image: url(../../assets/svg/link-w.svg);
        height: 7px;
        top: 12px;
      }

      &.adReply .el-input--suffix:before {
        background-image: url(../../assets/svg/ad-w.svg);
        height: 10px;
        width: 14px;
        top: 10px;
      }

      .el-input--suffix {
        &:before {
          content: '';
          width: 13px;
          position: absolute;
          left: 12px;
        }

        &:after {
          content: '';
          background-image: url(../../assets/svg/arrow.svg);
          width: 11px;
          height: 6px;
          position: absolute;
          top: 12px;
          right: 12px;
        }
      }

      .el-input__inner {
        background-color: #C34794;
        padding: 7px 14px 7px 35px;
        color: #FFF;
        border: none;
        height: auto;
        line-height: normal;
        border-radius: 18px;
      }
    }

    input {
      width: 100%;
    }

    .keywords {
      width: 100%;
    }

    .notice {
      color: #A9A9A9;
      font-size: 12px;
      text-align: right;
      font-style: italic;
      margin: 7px 0 10px;
    }
  }

  .campaign-type-dropdown {
    border-color: #C34794;
    margin-top: 3px !important;

    .popper__arrow {
      left: auto !important;
      right: 7px;
      border-bottom-color: #C34794 !important;
    }

    .el-select-dropdown__list {
      padding: 0;
    }

    .el-input__suffix-inner {
      display: none;
    }

    .el-select-dropdown__item {
      color: #A9A9A9;
      padding: 0 20px 0 35px;

      &:before {
        content: '';
        width: 13px;
        position: absolute;
        left: 12px;
      }

      &.story:before {
        background-image: url(../../assets/svg/bubble.svg);
        height: 11px;
        top: 12px;
      }

      &.story-mention:before {
        background-image: url(../../assets/svg/timer.svg);
        height: 13px;
        top: 10px;
      }

      &.post-share:before {
        background-image: url(../../assets/svg/link.svg);
        height: 7px;
        top: 14px;
      }

      &.ad-reply:before {
        background-image: url(../../assets/svg/ad.svg);
        height: 10px;
        top: 12px;
        width: 14px;
      }

      &:first-child {
        border-radius: 4px 4px 0 0;
      }

       &:last-child {
        border-radius: 0 0 4px 4px;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #DDDDDD;
      }

      &.hover:not(.selected) {
        background-color: #F6F6F6;
      }

      &.selected {
        background-color: #F1F1F1;
        font-weight: normal;
      }
    }
  }
</style>
