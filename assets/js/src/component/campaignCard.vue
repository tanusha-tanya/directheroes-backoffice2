<template>
    <builder-card class="campaign-card" :settings="campaignStep.displaySettings">
      <template slot="header">{{ campaign.name }}</template>
      <template slot="body">
        <el-select 
          :class="[{'campaign-type': true}, campaignData.messageType]" 
          v-model="campaignData.messageType"
          popper-class="campaign-type-dropdown"
        >
          <el-option class="story" label="Keywords" value="story">Keywords</el-option>
          <!-- <el-option class="story-mention" label="Story Mention" value="story-mention">Story Mention</el-option> -->
          <el-option class="post-share" label="Link" value="post-share">Link</el-option>
        </el-select>
        <template v-if="campaignData.messageType == 'story'">
          <keywords v-model="campaignData.value.keywords"></keywords>
        </template>
        <template v-if="campaignData.messageType == 'post-share'">
         <input placeholder="Please enter URL" v-model="campaignData.value.link">
         <div class="notice">Leave empty to target any url.</div>
        </template>
      </template>
    </builder-card>
</template>
<script>
import builderCard from "./builderCard.vue";
import keywords from "./keywords.vue";

export default {
  // data() {
  //   // return {
  //   //   campaignTypes: ['story', 'post-share']
  //   // }
  // },
  computed: {
    campaignStep() {
      return this.campaign.steps.find(step => step.type = 'campaignEntry')
    },

    campaignData() {
      return this.campaignStep.elements.find(element => element.type === 'messageCondition')
    },
  },

  components: {
    builderCard,
    keywords
  },

  props: ['campaign'],
}
</script>
<style lang="scss">
  div.campaign-card {
    background-color: #2A4294;

    .campaign-type {
      width: 100%;
      margin-bottom: 7px;
      margin-top: 10px;

      .el-input__suffix {
        display: none;
      }

      &.story .el-input--suffix:before {
        background-image: url(../assets/svg/bubble-w.svg);
        height: 11px;
        top: 10px;
      }

      &.story-mention .el-input--suffix:before {
        background-image: url(../assets/svg/timer-w.svg);
        height: 13px;
        top: 8px;
      }

      &.post-share .el-input--suffix:before {
        background-image: url(../assets/svg/link-w.svg);
        height: 7px;
        top: 12px;
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
          background-image: url(../assets/svg/arrow.svg);
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

    .builder-card-body {
      min-height: 140px;
      border-color: #2A4294;
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
      margin-top: 7px;
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
        background-image: url(../assets/svg/bubble.svg);
        height: 11px;
        top: 12px;
      }

      &.story-mention:before {
        background-image: url(../assets/svg/timer.svg);
        height: 13px;
        top: 10px;
      }

      &.post-share:before {
        background-image: url(../assets/svg/link.svg);
        height: 7px;
        top: 14px;
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

