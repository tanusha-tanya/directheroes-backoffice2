<template>
    <builder-card class="campaign-card">
      <template slot="header">{{ campaign.name }}</template>
      <template slot="body">
        <el-select 
          :class="[{'campaign-type': true}, campaign.typeCode]" 
          v-model="campaign.typeCode"
          popper-class="campaign-type-dropdown"
        >
          <el-option class="story" label="Keywords" value="story">Keywords</el-option>
          <el-option class="story-mention" label="Story Mention" value="story-mention">Story Mention</el-option>
          <el-option class="post-share" label="Link" value="post-share">Link</el-option>
        </el-select>
        <template v-if="campaign.typeCode == 'story'">
          <keywords v-model="campaign.keywords"></keywords>
        </template>
        <template v-if="campaign.typeCode == 'post-share'">
          Link
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

  components: {
    builderCard,
    keywords
  },

  props: ['campaign'],
}
</script>
<style lang="scss">
  div.campaign-card {
    border-color: #2A4294;
    background-color: #2A4294;
    left: 100px;
    top: calc(50% - 100px);

    .campaign-type {
      width: 100%;
      margin-bottom: 7px;
      margin-top: 10px;

      .el-input--suffix {
        &:before {
          content: '';
          background-image: url(../assets/svg/bubble.svg);
          width: 13px;
          height: 11px;
          position: absolute;
          top: 10px;
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
        padding: 7px 14px 7px 30px;
        color: #FFF;
        border: none;
        height: auto;
        line-height: normal;
        border-radius: 18px;
      }
    }

    .keywords {
      width: 100%;
    }
  }

  .campaign-type-dropdown {
    border-color: #C34794;
    margin-top: 2px;

    .popper__arrow {
      left: auto !important;
      right: 7px;
      border-bottom-color: #C34794 !important;
    }

    .el-select-dropdown__list {
      padding: 0;
    }

    .el-input__suffix-inner {
      display: none
    }

    .el-select-dropdown__item {
      color: #A9A9A9;

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
      }
    }
  }
</style>

