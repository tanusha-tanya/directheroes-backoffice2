<template>
  <div class="campaign-content" v-if="currentCampaign">
    <div class="content-panel">
      <div class="title">
        {{currentCampaign.name}}
        <div>
          {{currentCampaign.typeName}}
          <img src="../assets/info.svg"/>
        </div>
      </div>
      <div class="content-controls">
        <div class="content-button">
          <img src="../assets/send.svg"/>
          Test Campaign
        </div>
        <div class="content-button" @click="addTemplate">
          Add template
        </div>
        <div class="content-button" @click="renameCampaign">
          Rename Campaign
        </div>
        <div class="content-button">
          Archive
        </div>
        <label :class="{'content-button': true, 'not-active': !currentCampaign.active }">
          Active
          <el-switch v-model="currentCampaign.active" :width="30"></el-switch>
        </label>
      </div>
    </div>
    <el-collapse class="campaign-templates">
      <el-collapse-item class="campaign-template" :title="`Template ${ index + 1 }`" v-for="template, index in currentCampaign.templates" :key="index">
        <draggable v-model="template.rules" element="div" class="campaign-template-rules" :options="{ handle:'.rule-drag', animation: 300, forceFallback: true }">
          <div class="campaign-template-rule" v-for="rule in template.rules">
            <div class="rule-controls">
              <img class="rule-drag" src="../assets/drag.svg"/>
              <img src="../assets/drag.svg"/>
              <img @click="deleteRule(template, rule)" src="../assets/delete.svg"/>
            </div>
            <div class="rule-messages">
              <div class="rule-messages-title">
                <img src="../assets/star.svg"/>
                If follower messages…
              </div>
              <el-select v-model="rule.messages"
                class="scroller"
                placeholder="Enter messages"
                multiple
                filterable
                allow-create
                default-first-option
              ></el-select>
            </div>
            <div class="rule-replies-icon">
              <img src="../assets/comment.svg"/>
            </div>
            <div class="rule-replies">
              <div class="rule-replies-title">
                <span>
                  <img src="../assets/ico-robot.png"/>
                  Replies with…
                </span>
                <span class="rule-replies-action">
                  Add action
                  <img src="../assets/valve.svg"/>
                </span>
              </div>
              <el-input
                type="textarea"
                placeholder="Enter replies"
                v-model="rule.replies.text">
              </el-input>
            </div>
          </div>
        </draggable>
        <div class="add-rule-button">
          <div @click="addRule(template)">
            <img src="../assets/star-white.svg"/>
            Add rule
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'
  import { Switch, Collapse, CollapseItem, Select, Input } from 'element-ui'

  export default {
    beforeRouteEnter(to, from, next) {
      next(accountCampaign => {
        accountCampaign.setCurrentCampaign(to);
      })
    },

    beforeRouteUpdate(to, from, next) {
      this.setCurrentCampaign(to);
      next();
    },

    data() {
      return {
        currentCampaign: null,
      }
    },

    components: {
      draggable,
      'el-input': Input,
      'el-select': Select,
      'el-switch': Switch,
      'el-collapse': Collapse,
      'el-collapse-item': CollapseItem
    },

    computed: {
    },
    methods: {
      setCurrentCampaign(route) {
        const { campaignId } = route.params;
        const { campaignList } = this.$store.state.currentAccount;

        if (!campaignList || !campaignId) return;

        this.currentCampaign = campaignList.find(campaign => campaign.id == campaignId);
      },

      addRule(template) {
        template.rules.push({
          messages: [],
          replies: {
            text: ''
          }
        });
      },

      deleteRule(template, rule) {
        const { rules } = template
        const ruleIndex = rules.indexOf(rule)

        rules.splice(ruleIndex, 1);

        if (!rules.length) {
          const { templates } = this.currentCampagin;
          const templateIndex = templates.indexOf(template)

          templates.splice(templateIndex, 1);
        }
      },

      addTemplate() {
        const { templates } = this.currentCampaign;
        const template =  {
          rules:[]
        }

        this.addRule(template);

        templates.push(template);
      },

      renameCampaign() {
        this.$store.state.campaignToRename = this.currentCampaign;
      }
    },

    watch: {
      '$store.state.accounts'() {
        if (this.currentCampaign) return;

        this.setCurrentCampaign(this.$route);
      }
    }
  }
</script>
<style lang="scss">
  .campaign-content {

    .title {
      img {
        width: 16px;
        height: 16px;
      }

      div {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
      }
    }

    .content-button {
      .el-switch {
        margin-left: 7px;
      }
    }

    .campaign-templates {
      margin: 24px 30px 24px 15px;
    }

    .campaign-template {
      &.is-active {
        .el-collapse-item__arrow {
          transform: rotate(90deg);
        }
      }

      &:not(:first-child) {
        margin-top: 30px;
      }

      .el-collapse-item__arrow {
        background-image: url(../assets/arrow.svg);
        width: 24px;
        height: 24px;
        opacity: .5;
        transition: .2s transform;
      }

      .el-collapse-item__header {
        padding: 10px 8px 9px 8px;
        outline: none;
        display: flex;
        border-radius: 30px;
        align-items: center;
        background-color: #E0DFE4;
        cursor: pointer;
        font-weight: 600;
        color: #76708C;

        & > span {
          display: flex;
          align-items: center;
        }
      }

      .add-rule-button {
        text-align: center;

        div {
          background-color: #7276AC;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #fff;
          display: inline-flex;
          align-items: center;
          padding: 6px 16px 6px 9px;
          margin-top: 12px;
          cursor: pointer;
        }

        img {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
      }

    }

    .campaign-template-rule {
      padding: 30px 0;
      height: 195px;
      border-bottom: 1px solid #E6E5E9;
      display: flex;

      .rule-controls {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        opacity: 0.2;
        margin-right: 20px;
        flex-shrink: 0;

        img {
          width: 24px;
          cursor: pointer;
        }
      }

      .rule-messages {
        background: #fff;
        padding: 13px;
        border-radius: 7px;
        height: 100%;
        flex-grow: 1;
        width: 50%;

        .el-select {
          width: 100%;
          height: 100%;
          max-height: calc(100% - 34px);
          overflow: auto;
          display: inline-block;
          border: 1px solid #E1E1E1;
          border-radius: 5px;
          position: relative;

          .el-input {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            padding: 0 10px;
          }

          .el-select__tags {
            line-height: normal;
            white-space: normal;
            z-index: 5;
            position: relative;
            margin: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            max-width: 100% !important;
            margin-top: 6px;
          }

          .el-tag {
            color: #fff;
            margin: 3px 0 3px 6px;
            background-color: #434890;
            border-radius: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 3px 0 10px;
            min-width: 85px;
            height: 24px;
            padding: 0 8px;
            line-height: 22px;
          }

          .el-input__inner {
            background-color: #fff;
            background-image: none;
            border: none;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            height: 100%;
            outline: none;
            width: 100%;
          }

          .el-select__input {
            border: none;
            outline: none;
            padding: 0;
            margin-left: 10px;
            color: #666;
            font-size: 14px;
            height: 28px;
            background-color: transparent;
          }

          .el-tag__close {
            cursor: pointer;
            height: 16px;
            width: 16px;
            background-color: #434890;
            margin-left: 8px;
            background-image: url(../assets/icon.svg);
          }
        }

        .rule-messages-title{
          display: flex;
          align-items: center;
          font-weight: 600;
          margin-bottom: 10px;
        }

        img {
          width: 24px;
          margin-right: 2px;
        }
      }

      .rule-replies-icon {
        display: flex;
        align-items: center;
        margin: 0 20px;
        height: 100%;
        opacity: 0.2;

        img {
          width: 24px;
        }
      }

      .rule-replies {
        background: #fff;
        padding: 13px;
        border-radius: 7px;
        height: 100%;
        flex-grow: 1;
        width: 50%;

        .el-textarea {
          width: 100%;
          height: 100%;
          max-height: calc(100% - 34px);
          border: 1px solid #E1E1E1;
          border-radius: 5px;

          textarea {
            width: 100%;
            height: 100%;
            padding: 5px;
            resize: none;
            border: none;
            outline: none;
            background: none;
            font-size: 14px;
            line-height: 20px;

            &::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }

            &::-webkit-scrollbar-button {
              width: 0px;
              height: 0px;
            }

            &::-webkit-scrollbar-thumb {
              background-color: #d2d2d2;
              border: 0px none #ffffff;
              border-radius: 50px;
              transition: .2s background-color
            }

            &::-webkit-scrollbar-thumb:hover, &::-webkit-scrollbar-thumb:active {
              background-color: #a4a4a4;
            }

            &::-webkit-scrollbar-track {
              background-color: #f8f8f8;
              border: 0px none #ffffff;
              border-radius: 50px;
            }

            &::-webkit-scrollbar-track:hover, &::-webkit-scrollbar-track:active {
              background: #ffffff;
            }

            &::-webkit-scrollbar-corner {
              background: transparent;
            }
          }
        }

        .rule-replies-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          line-height: 24px;
          margin-bottom: 10px;

          span {
            display: flex;
            align-items: center;
          }

          .rule-replies-action {
            color: #858099;

            img {
              opacity: .5;
              width: 20px;
            }
          }

          img {
            margin-right: 8px;
          }
        }
      }
    }
  }
</style>