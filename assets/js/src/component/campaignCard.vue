<template>
    <builder-card class="campaign-card">
      <template slot="header">{{ campaign.name }}</template>
      <template slot="body">
        <el-select :class="[{'campaign-type': true}, campaign.typeCode]" v-model="campaign.typeCode">
          <el-option class="story" label="Keywords" value="story">Keywords</el-option>
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
</style>

