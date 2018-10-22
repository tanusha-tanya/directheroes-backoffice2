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
        <el-dropdown class="content-button" trigger="click" v-if="currentCampaign.typeCode === 'postShareCampaign'">
          <div>Settings</div>
          <el-dropdown-menu slot="dropdown" class="share-settings">
            <el-radio v-model="shareType" label="all"> All Posts</el-radio>
            <el-radio v-model="shareType" label="special"> Special Post Link</el-radio>
            <input v-model="currentCampaign.postLink" placeholder="Enter post link" :disabled="shareType !== 'special'"/>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div class="content-button" @click="triggerBroadCastSettings">Settings</div> -->
        <el-popover class="content-button" placement="bottom" v-if="currentCampaign.typeCode === 'broadcastCampaign'">
          <div class="broadcast-settings">
            <div class="settings-title">Select date, time to broadcast</div>
            <el-date-picker
              :disabled="currentCampaign.isStarted"
              v-model="currentCampaign.startsAt"
              type="datetime"
              placeholder="Select date and time">
            </el-date-picker>
            <div class="settings-title">Select subscribers to broadcast.</div>
            <el-checkbox
              :disabled="currentCampaign.isStarted"
              v-for="subscriber in currentAccount.subscriberCategoryList" 
              :key="subscriber.id"
              :checked="isCheckedSubscriber(subscriber.id)"
              @change="checkSubscriber(subscriber, $event)"
              >
              {{ subscriber.name }}
            </el-checkbox>
          </div>
          <div slot="reference">Settings</div>
        </el-popover>
        <div v-if="false" class="content-button">
          <img src="../assets/send.svg"/>
          Test Campaign
        </div>
        <div class="content-button" @click="addTemplate">
          Add template
        </div>
        <div class="content-button" @click="renameCampaign">
          Rename Campaign
        </div>
        <div class="content-button" @click="deleteCampaign">
          Archive
        </div>
        <label :class="{'content-button': true, 'not-active': !currentCampaign.enabled }">
          Active
          <el-switch v-model="currentCampaign.enabled" :width="30"></el-switch>
        </label>
      </div>
    </div>
    <el-collapse class="campaign-templates">
      <el-collapse-item class="campaign-template" :title="`Template #${ templateIndex + 1 }`" v-for="(template, templateIndex) in currentCampaign.templateList" :key="template.id">
        <draggable v-model="template.rules" element="div" class="campaign-template-rules" :options="{ handle:'.rule-drag', animation: 300, forceFallback: true }">
          <div class="campaign-template-rule" v-for="rule, ruleIndex in template.ruleList">
            <div class="rule-controls">
              <img class="rule-drag" src="../assets/drag.svg" v-if="template.ruleList.length > 1" />
              <span v-else></span>
              <img v-if="false" src="../assets/eye.svg"/>
              <img @click="deleteRule(template, rule)" src="../assets/delete.svg" v-if="templateIndex || (!templateIndex && template.ruleList.length > 1)"/>
              <span v-else></span>
            </div>
            <div class="rule-messages"  v-if="!(onlyReplies && !ruleIndex && !templateIndex)">
              <div class="rule-messages-title">
                <img src="../assets/star.svg"/>
                If follower messages…
              </div>
              <el-select v-model="rule.triggerPhraseList"
                class="scroller"
                placeholder="Enter messages"
                multiple
                filterable
                allow-create
                default-first-option
                @change="checkTrigger($event, rule)"
                @keydown.native="selectChange($event, rule)"
              ></el-select>
            </div>
            <div class="rule-replies-icon"  v-if="!(onlyReplies && !ruleIndex && !templateIndex)">
              <img src="../assets/comment.svg"/>
            </div>
            <div class="rule-replies">
              <template v-for="(action, index) in rule.actions">
                <div class="delay-settings-area" v-if="index">
                  <div class="delay-settings">
                    <font-awesome-icon :icon="['far', 'clock']" />
                    Delay:
                    <input type="number" v-model="action.delayMs" min="0" step="50"/>
                    ms
                  </div>
                </div>
                <div class="rule-replies-body">
                  <div class="rule-replies-title">
                    <span>
                      <img src="../assets/ico-robot.png"/>
                      Replies with…
                    </span>
                    <div v-if="!index">
                      <subscribe-category :categories="rule.subscriberCategoryList"></subscribe-category>
                    </div>
                    <img v-if="index" @click="deleteSequence(rule, index)" class="delete-action" src="../assets/times.svg"/>
                  </div>
                  <el-input
                    type="textarea"
                    placeholder="Enter replies"
                    v-model="action.messageTemplate">
                  </el-input>
                  <div class="upload-button">
                    <div class="upload-file">
                      <input type="file" @change="uploadFile($event, action.medias)"/>
                      <span>Add files</span>
                    </div>
                    <el-popover class="upload-message" v-if="action.medias.length" placement="bottom">
                      <div class="uploaded-files">
                        <div class="file-item" v-for="(file, index) in action.medias" :key="file.id">{{file.name}}<img src="../assets/times.svg" @click="deleteMedia(action.medias, index)"/></div>
                      </div>
                      <div slot="reference">
                        Attached {{action.medias.length}} file(s)
                      </div>
                    </el-popover>
                  </div>
                </div>
              </template>
              <div class="add-sequence-area">
                <div class="add-sequence-button" @click="addSequence(rule)">+</div>
              </div>
            </div>
          </div>
        </draggable>
        <div class="add-rule-button">
          <div @click="addRule(template)" v-if="!onlyReplies || (onlyReplies && templateIndex) ">
            <img src="../assets/star-white.svg"/>
            Add rule
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div class="loading-content" v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>
  import axios from 'axios'
  import draggable from 'vuedraggable'
  import subscribeCategory from '../component/subscribeCategory.vue'
  import debounce from 'lodash/debounce'
  import { Switch, Collapse, CollapseItem, Select, Radio, Input, Popover, Dropdown, DropdownMenu, DatePicker, Checkbox } from 'element-ui'

  const campaignsToSave = [];

  export default {
    beforeRouteEnter(to, from, next) {
      next(accountCampaign => {
        accountCampaign.setCurrentCampaign(to);
      })
    },

    beforeRouteUpdate(to, from, next) {
      this.currentCampaign = null;

      this.setCurrentCampaign(to);
      next();
    },

    data() {
      return {
        currentCampaign: null,
        updateState: false,
        shareType: 'all',
      }
    },

    components: {
      'subscribe-category': subscribeCategory,
      draggable,
      'el-input': Input,
      'el-select': Select,
      'el-switch': Switch,
      'el-collapse': Collapse,
      'el-collapse-item': CollapseItem,
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-radio': Radio,
      'el-date-picker': DatePicker,
      'el-popover': Popover,
      'el-checkbox': Checkbox
    },

    computed: {
      currentAccount() {
        return this.$store.state.currentAccount;
      },

      onlyReplies() {
        return ['welcomeCampaign', 'broadcastCampaign'].includes(this.currentCampaign.typeCode);
      }
    },

    methods: {
      checkSubscriber(subscriber, checked) {
        this.currentCampaign.subscriberCategoryList = this.currentCampaign.subscriberCategoryList || [];
        
        const { subscriberCategoryList } = this.currentCampaign;

        if (checked) {
          subscriberCategoryList.push(subscriber);
        } else {
          subscriberCategoryList.splice(subscriberCategoryList.indexOf(subscriberCategoryList.find(customer => customer.id === subscriber.id)), 1)
        }
      },

      checkTrigger(triggerList, rule) {
        rule.triggerPhraseList = triggerList.filter(trigger => trigger.trim())
      },

      isCheckedSubscriber(id) {
        return (this.currentCampaign.subscriberCategoryList || []).some(subscriber => subscriber.id == id)
      },

      setCurrentCampaign(route) {
        const { campaignId } = route.params;
        const { campaignList } = this.$store.state.currentAccount;

        if (!campaignList || !campaignId) return;

        const currentCampaign = campaignList.find(campaign => campaign.id == campaignId);

        if (currentCampaign.templateList) {
          this.currentCampaign = currentCampaign;
        } else {
          this.$store.dispatch('getCampaignTemplates', currentCampaign)
            .then(({ data }) => {
              this.currentCampaign = data.campaign;
            });
        }
      },

      addRule(template) {
        const ruleObject = {
          actions: [{
            // triggerPhraseList: [],
            messageTemplate: "",
            delayMs: 0,
            medias: []
          }],
          messageTemplate: "",
        }

        if (!template.ruleList.length) {
          ruleObject.subscriberCategoryList = [] 
        }

        template.ruleList.push(ruleObject);
      },

      deleteRule(template, rule) {
        const { ruleList } = template
        const ruleIndex = ruleList.indexOf(rule)

        ruleList.splice(ruleIndex, 1);

        if (!ruleList.length) {
          const { templateList } = this.currentCampaign;
          const templateIndex = templateList.indexOf(template)

          templateList.splice(templateIndex, 1);
        }
      },

      addSequence(rule) {
        rule.actions.push({
          delayMs: 0,
          medias: [],
          messageTemplate: ""
        })
      },

      deleteSequence(rule, actionIndex) {
        rule.actions.splice(actionIndex, 1);
      },

      addTemplate() {
        const { templateList } = this.currentCampaign;
        const { dynId, uuidv4 } = this.utils;
        const template =  {
          id: dynId(),
          uuid: uuidv4(),
          name: "Template #",
          ruleList:[]
        }

        this.addRule(template);

        templateList.push(template);
      },

      renameCampaign() {
        this.$store.state.campaignToRename = this.currentCampaign;
      },

      saveCampaigns: debounce(function() {
        const campaigns = campaignsToSave.slice(0);

        campaignsToSave.splice(0, campaignsToSave.length)

        this.updateState = true;
        this.$store.dispatch('saveCampaigns', campaigns)
          .then(({ data }) => {
            this.updateState = false;

            this.$message.success({
              message: 'Success saved',
              duration: 3000,
              center: true
            });
          })
          .catch(() => {
            this.$message.error({
              message: 'Error saved',
              duration: 3000,
              center: true
            })
          });
      }, 3000),

      deleteCampaign() {
        this.$store.dispatch('deleteCampaign', this.currentCampaign)
          .then(({ data }) => {
            const { currentAccount } = this.$store.state;
            const { campaignList } = currentAccount;

            if (!campaignList.length) {
              this.$router.replace({ name: 'accountCurrent', params: { accountId: currentAccount.id } })
            } else {
              this.$router.replace({ name: 'accountCampaign', params: { campaignId: campaignList[0].id, accountId: currentAccount.id } })
            }

            this.$message.success({
              message: 'Success delete',
              duration: 3000,
              center: true
            });
          }).catch(() => {
            this.$message.error({
              message: 'Error delete',
              duration: 3000,
              center: true
            })
          });
      },

      selectChange(event, rule) {
        const { target } = event;
        const { triggerPhraseList } = rule;

        if ([188, 9].includes(event.keyCode)) {

          if (!target.value) {
            target.value = '';
            return;
          }

          event.preventDefault();

          if (triggerPhraseList.includes(target.value)) {
            triggerPhraseList.splice(triggerPhraseList.indexOf(target.value), 1)
          } else {
            triggerPhraseList.push(target.value.replace(',', ''));
          }

          target.value = '';

          return false;
        }
      },

      deleteMedia(medias, mediaIndex) {
        medias.splice(mediaIndex, 1);
      },

      uploadFile(event, medias) {
        const files = event.target.files;
        const formData = new FormData();
        const { uuidv4 } = this.utils;

        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          formData.append('file', file, file.name);
        }

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/file/upload`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(({ data }) => {
          medias.push(data.response.body);
        });

        event.preventDefault();
      },
    },

    watch: {
      '$store.state.accounts'() {
        if (this.currentCampaign) return;

        this.setCurrentCampaign(this.$route);
      },

      currentCampaign: {
        handler: function (campaign, oldCampaign) {
          if (campaign && campaign.typeCode === 'postShareCampaign') {
            this.shareType = campaign.postLink ? 'special' : 'all'
          }

          if (!oldCampaign || !campaign || campaign.uuid !== oldCampaign.uuid || this.updateState) return;

          if (!campaignsToSave.includes(campaign)) {
            campaignsToSave.push(campaign);
          }

          this.saveCampaigns();
        },
        deep: true
      },

      shareType(type) {
        if (type !== 'all') return;

        this.currentCampaign.postLink = '';
      }
    }
  }
</script>
<style lang="scss">
  .campaign-content {

    .content-button {
      
      & > div {
        outline: none;
      }

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
        padding: 10px 18px 9px 8px;
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
      padding: 30px 0 0;
      // height: 195px;
      border-bottom: 1px solid #E6E5E9;
      display: flex;

      .delay-settings-area {
        border: 1px solid #E6E5E9;
        height: 0px;
        margin: 20px 0;
        display: flex;

        .delay-settings {
          background: #fff;
          height: 30px;
          border: 1px solid #E6E5E9;
          border-radius: 15px;
          margin: -15px auto 0;
          font-size: 12px;
          padding: 3px 10px;
          color: #acacac;

          input {
            border: 0;
            padding: 1px 4px;
            font-size: 12px;
            width: 70px;
          }
        }
      }

      .add-sequence-area {
        border: 1px solid #E6E5E9;
        height: 0px;
        margin: 20px 0;

        .add-sequence-button {
          background: #fff;
          height: 30px;
          width: 30px;
          border: 1px solid #E6E5E9;
          border-radius: 15px;
          margin: -15px auto 0;
          color: #909399;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .2s;

          &:hover {
            background-color: #434890;
            color: #fff;
            border-color: #434890;
          }
        }
      }

      .rule-controls {
        display: flex;
        flex-direction: column;
        height: 150px;
        justify-content: space-between;
        margin-right: 20px;
        flex-shrink: 0;

        & > *:not(div) {
          opacity: 0.2;
        }

        img {
          width: 24px;
          cursor: pointer;
        }

        span {
          height: 24px;
          width: 24px;
        }
      }

      .rule-messages {
        background: #fff;
        padding: 13px;
        border-radius: 7px;
        height: 150px;
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
        height: 150px;
        opacity: 0.2;

        img {
          width: 24px;
        }
      }

      .rule-replies {
        height: 100%;
        flex-grow: 1;
        width: 50%;

        .rule-replies-body {
          background: #fff;
          padding: 13px;
          border-radius: 7px;
          height: 150px;
          margin-bottom: 15px;

          .delete-action {
            width: 18px;
            margin: 0;
          }
        }

        .el-textarea {
          width: 100%;
          height: 100%;
          max-height: calc(100% - 57px);
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

          img {
            margin-right: 8px;
          }
        }
      }
    }
  }

  .broadcast-settings {
    .settings-title {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .el-date-editor {
      margin-bottom: 16px;
    }
  }

  .share-settings {
    // display: flex;
    // flex-direction: column;
    padding: 5px 15px 15px;

    & > div {
      font-size: 12px;
    }

    .el-radio {
      margin-top: 10px;
      display: block;
    }

    input {
      margin-top: 5px;
    }
  }

  .upload-file {
    height: 15px;
    position: relative;
    background: url(../assets/clip.svg) no-repeat left;
    overflow: hidden;
    opacity: .4;
    padding-left: 15px;

    &:hover {
      cursor: pointer;
      opacity: .6;
    }

    input {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
  }

  .upload-button {
    display: flex;
    margin: 10px 0;
    justify-content: space-between;
  }

  .upload-message {
    cursor: pointer; 
  }

  .uploaded-files {
    .file-item {
      display: flex;
      padding: 3px 0;
      justify-content: space-between;
      align-items: center;

      img {
        width: 10px;
        height: 10px;
      }
    }  
  }
</style>
