<template>
  <div class="compaign-content" v-if="currentCompagin">
    <div class="compaign-panel">
      <div class="compaign-title">
        <strong>{{currentCompagin.name}}</strong>
        <div>
          {{currentCompagin.type}}
          <img src="../assets/info.svg"/>
        </div>
      </div>
      <div class="compaign-controls">
        <div class="compaign-button">
          <img src="../assets/send.svg"/>
          Test Compaign
        </div>
        <div class="compaign-button">
          Add template
        </div>
        <div class="compaign-button">
          Rename Compagin
        </div>
        <div class="compaign-button">
          Archive
        </div>
        <label :class="{'compaign-button': true, 'not-active': !currentCompagin.active }">
          Active
          <el-switch v-model="currentCompagin.active" :width="30"></el-switch>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
  import { Switch } from 'element-ui'

  export default {
    components: {
      'el-switch': Switch
    },

    computed: {
      currentCompagin() {
        const { compaignId } = this.$route.params;
        const { compaigns } = this.$store.state.currentAccount;

        if (!compaigns || !compaignId) return;

        return compaigns.find(compaign => compaign.id == compaignId);
      }
    }
  }
</script>
<style lang="scss">
  .compaign-content {

    .compaign-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 17px;
      background-color: #EEEEEE;
    }

    .compaign-title {
      strong {
        line-height: 23px;
        font-size: 16px;
      }

      img {
        width: 16px;
        height: 16px;
      }

      div {
        display: flex;
        align-items: center;
      }
    }

    .compaign-controls {
      display: flex;
    }

    .compaign-button {
      display: flex;
      align-items: center;
      color: #85539C;
      white-space: nowrap;
      margin: 0 15px;
      cursor: pointer;
      opacity: .5;

      & {
        opacity: 1
      }

      &.not-active {
        opacity: .5;

        &:hover {
          opacity: .8;
        }
      }

      img {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }

      .el-switch {
        margin-left: 7px;
      }
    }
  }
</style>