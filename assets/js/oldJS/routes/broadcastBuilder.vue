<template>
  <div class="broadcast-builder">
    <!-- <div class="broadcast-builder-controls">
      <span>Broadcast Builder</span>
      <div class="broadcast-warning" v-if="currentBroadcast && hasWarning"><img src="../assets/triangle.svg">This broadcast is incomplete</div>
      <div class="info" v-if="currentBroadcast && isComplete">
        <div>Broadcast complete</div>
      </div>
      <div class="info" v-else-if="currentBroadcast && !hasWarning">
        <div class="start-message" v-if="timeToStart">{{ timeToStart }}</div>
        <div class="fail-message" v-if="notStarted">Campaign didn't start</div>
        <div class="start-message" v-else-if="!timeToStart && !isStarted && !notStarted && startAt">Prepare to start</div>
        <div class="start-message" v-if="isStarted">Broadcast was started</div>
        <div v-if="!startAt">Click to set broadcast</div>
      </div>
      <div class="broadcast-builder-divider" v-if="currentBroadcast"></div>
      <div class="broadcast-builder-control gear" v-if="currentBroadcast" @click="isSettings = !isSettings">
        <img src="../assets/svg/gear.svg"/>
      </div>
    </div> -->
    <div class="broadcast-first-step" v-if="currentBroadcast && !currentBroadcast.steps.length">
      <div class="broadcast-flow-choose">
        <div class="broadcast-choose-info">
          Create
        </div>
        <div class="broadcast-choose-buttons">
          <div class="broadcast-choose-button">
            <add-step-popup @add-step="addStep" :available-list="availableElements">
              <span>New flow</span>
            </add-step-popup>
          </div>
          <!-- <div class="campaign-choose-button">Clone flow</div> -->
        </div>
        <div class="broadcast-choose-info">
          You can also create a block by double clicking on the canvas
        </div>
      </div>
    </div>
    <flow-builder v-else-if="currentBroadcast" :entry-item="currentBroadcast" :disabled="startAt && blockStatus" :has-warning="hasWarning" ref="flowBuilder"></flow-builder>
    <div class="broadcast-settings" v-if="isSettings" @click="isSettings = false">
    <div class="broadcast-settings-area" @click.stop="">
      <div class="broadcast-settings-controls">
        Broadcast on:
          <el-date-picker
            v-model="startAt"
            type="datetime"
            time-arrow-control
            :clearable="false"
            size="mini"
            :disabled="(startAt && blockStatus) || Boolean(hasWarning)"
            :picker-options="pickerOptions"
            placeholder="Select date and time">
          </el-date-picker>
        or:
          <button @click="setNowDate" :disabled="(startAt && blockStatus) || Boolean(hasWarning)">Broadcast now</button>
      </div>
      <div class="broadcast-settings-info">
        <div class="broadcast-settings-campaign-list">
          <check-box-branch v-for="item in subscriberMainCategory" :key="item.id" :item="item" :checkedList="currentBroadcast.settings.categoryList"></check-box-branch>
        </div>
        <div class="broadcast-chart">
          <el-progress type="circle" :percentage="messagesInfo.sentPercent" :stroke-width="12" color="#64c6cc"></el-progress>
          <div class="broadcast-chart-info">
            Messages sent
            <strong>{{messagesInfo.sentMessages}} / {{messagesInfo.sentMessages + messagesInfo.remainingMessages}}</strong>
          </div>
        </div>
        <div class="broadcast-chart">
          <el-progress type="circle" :percentage="conversationInfo.completedPercent" :stroke-width="12" color="#473cd0"></el-progress>
          <div class="broadcast-chart-info">
            Conversation completed
            <strong>{{conversationInfo.completedConversations}} / {{conversationInfo.completedConversations + conversationInfo.remainingConversations}}</strong>
          </div>
        </div>
        <div class="broadcast-estimated-time" v-if="estimatedTime">
          Estimated time
          <div><strong>{{estimatedTime}}</strong></div>
        </div>
      </div>
      <div class="broadcast-additional-info">
        Total subscribers:
        <span v-if="inGetCount" class="broadcast-esimating">estimating...</span>
        <span v-else-if="totalSubscribers == null" class="broadcast-count-error">Failed to calculate</span>
        <span v-else>{{ totalSubscribers }}</span>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import elementsPermissions from '../elements/permissions'
import ObjectId from '../utils/ObjectId'
import utils from '../utils'
import Vue from 'vue'
import axios from 'axios'
import flowBuilder from '../component/flowBuilder.vue'
import addStepPopup from '../component/addStepPopup.vue'
import checkBoxBranch from '../component/checkBoxBranch.vue'
import moment from 'moment'

let countTimeout = null;

export default {

  data() {
    return {
      isSettings: false,
      broadcastTimeout: null,
      broadcastRuntime: null,
      inGetCount: true,
      totalSubscribers: null,
      broadcastStartTimeout: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
    }
  },

  props: ['currentBroadcast'],

  components: {
    flowBuilder,
    checkBoxBranch,
    addStepPopup
  },

  computed:{
    account() {
      return this.$store.state.currentAccount;
    },

    startAt: {
      get() {
        const { startAt } = this.currentBroadcast.settings;

        return typeof startAt == 'number' ? startAt * 1000 : startAt
      },
      set(value) {
        const { account, currentBroadcast } = this
        const { settings } = this.currentBroadcast;
        const startAtDate = moment(value);

        Vue.set(settings, 'startAt', startAtDate.isValid() ? startAtDate.utc().format() : null);
        settings.startTimeSetAt = startAtDate.isValid() ? moment().utc().format() : null;

        this.broadcastRuntime = null;

        this.setBroadcastStart();
      }
    },

    hasWarning() {
      const { currentBroadcast } = this;

      if (!currentBroadcast) return;

      return utils.hasCampaignWarning(currentBroadcast);
    },

    subscriberMainCategory() {
      const { subscriberCategoryList, campaignList, broadcastList } = this.account;
      const subscriberMainCategories = []

      subscriberCategoryList.forEach((item, index) => {
        if (item.isCampaignMainCategory) {
          const mainCategory = subscriberMainCategories.find(category => category.mdbCampaignId == item.mdbCampaignId);

          if (!mainCategory) {
            subscriberMainCategories.push(JSON.parse(JSON.stringify(item)));
          } else if (!mainCategory.isCampaignMainCategory) {
            subscriberMainCategories.splice(subscriberMainCategories.indexOf(mainCategory), 1, JSON.parse(JSON.stringify(item)));
          }

          return;
        } else if (item.mdbCampaignId) {
          let mainCategory = subscriberMainCategories.find(category => category.mdbCampaignId == item.mdbCampaignId);

          if (!mainCategory) {
            const campaigns = campaignList.concat(broadcastList);
            const parentCampaign = campaigns.find(campaign => campaign.id == item.mdbCampaignId);

            mainCategory = { name: parentCampaign.name, mdbCampaignId: parentCampaign.id }

            subscriberMainCategories.push(mainCategory);
          }

          mainCategory.list = mainCategory.list || [];

          mainCategory.list.push(item)
        } else {
          let mainCategory = subscriberMainCategories.find(category => !category.mdbCampaignId);

          if (!mainCategory) {
            mainCategory = { name: 'Manual' }

            subscriberMainCategories.push(mainCategory);
          }

          mainCategory.list = mainCategory.list || [];

          mainCategory.list.push(item);
        }
      })

      return subscriberMainCategories
    },

    messagesInfo() {
      const broadcastRuntime = this.broadcastRuntime || {}
      const { sentMessages = 0, remainingMessages = 0 } = broadcastRuntime;

      return {
        sentMessages: sentMessages,
        sentPercent: Math.ceil(100 - remainingMessages * 100 / (sentMessages + remainingMessages)) || 0,
        remainingMessages: remainingMessages
      };
    },

    conversationInfo() {
      const broadcastRuntime = this.broadcastRuntime || {};
      const { completedConversations = 0, remainingConversations = 0 } = broadcastRuntime;

      return {
        completedConversations: completedConversations,
        completedPercent: Math.ceil(100 - remainingConversations * 100 / (completedConversations + remainingConversations)) || 0,
        remainingConversations: remainingConversations
      };
    },

    estimatedTime() {
      const broadcastRuntime = this.broadcastRuntime || {};
      const { estimatedTime } = broadcastRuntime;
      const date = new Date(null);

      if (!estimatedTime) return;

      date.setSeconds(estimatedTime);

      let stringTime = date.getUTCHours() + 'h ' + date.getUTCMinutes() + 'm ' +  date.getUTCSeconds() + 's';

      const days = Math.floor(estimatedTime / (3600*24));

      if (days) {
        stringTime = days + 'd ' + stringTime;
      }

      return stringTime
    },

    availableElements() {
      return elementsPermissions.fromBroadcastFlow
    },

    timeToStart() {
      const { startAt } = this;

      return `${moment().from(new Date(startAt), true)} to start`
    },

    blockStatus() {
      const { broadcastRuntime } = this;

      if (!broadcastRuntime) return true;

      return ['running', 'completed'].includes(broadcastRuntime.status);
    }
  },

  methods: {
    getTotalSubscribers() {
      const { categoryList } = this.currentBroadcast.settings;

      if (!categoryList.length) {
        this.totalSubscribers = 0
        this.inGetCount = false;

        return;
      }

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/category/count-subscribers`,
        method: 'post',
        data: { categories:categoryList.map(category => category.id), accountId: this.account.id }
      }).then(({ data }) => {
        const { count } = data.response.body

        this.inGetCount = false;

        this.totalSubscribers = count
      }).catch(error => {
        this.totalSubscribers = null
        this.inGetCount = false;
      })
    },

    setBroadcastStart() {
      const { account, currentBroadcast } = this
      const { settings } = this.currentBroadcast;

      clearTimeout(this.broadcastStartTimeout);

      this.broadcastStartTimeout = setTimeout(() => {
        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/${ currentBroadcast.id }/runtime-info`,
          method: 'post',
          data: {
            accountId: account.id,
            startAt: settings.startAt
          }
        }).then(({ data }) => {
          this.broadcastRuntime = data.response.body.broadcastRuntime

          this.updateBroadcastStatus();
        }).catch(() => {
          this.setBroadcastStart()
        })
      }, 3000)
    },

    setNowDate() {
      this.startAt = moment().utc().format();
    },

    updateBroadcastStatus() {
      const { startAt, currentBroadcast, updateBroadcastStatus } = this;

      clearTimeout(this.broadcastTimeout)

      if (!startAt) return;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/${ currentBroadcast.id }/runtime-info`,
      }).then(({ data }) => {
        this.broadcastRuntime = data.response.body.broadcastRuntime

        this.broadcastTimeout = setTimeout(updateBroadcastStatus.bind(this), 10 * 1000)
      }).catch(() => {
        this.broadcastTimeout = setTimeout(updateBroadcastStatus.bind(this), 10 * 1000)
      })

      // clearTimeout(this.broadcastTimeout)

      // this.timeToStart = (!startAt || moment().diff(new Date(startAt)) > 0) ? null : `${moment().from(new Date(startAt), true)} to start`

      // if ((diff > 60 * 60 * 1000) || isStarted || notStarted) return;

      // if (diff < 60 * 1000 && diff > 0) {
      //   timeout = 1000;
      // } else if (!this.timeToStart) {
      //   this.$store.dispatch('saveCampaign', this.currentBroadcast)
      //   .then(({ data }) => {
      //     this.broadcastTimeout = setTimeout(this.updateBroadcastStatus.bind(this), 10 * 1000)
      //   })
      //   .catch(() => {
      //     this.broadcastTimeout = setTimeout(this.updateBroadcastStatus.bind(this), 30 * 1000)
      //   });
      //   return;
      // }

      // this.broadcastTimeout = setTimeout(this.updateBroadcastStatus.bind(this), timeout)
    },

    addStep(element) {
      const step = {
        id: (new ObjectId).toString(),
        displaySettings: {
          isEntry: true
        },
        elements: []
      }

      if (element.type === 'group') {
        const { elements } = element;

        elements.forEach(element => element.id = (new ObjectId).toString())
      }

      step.elements.push( {
        id: (new ObjectId).toString(),
        ...element
      })

      this.currentBroadcast.steps.push(step);
    },

    findWarningStep() {
      const { hasWarning } = this;
      const { flowBuilder } = this.$refs;

      flowBuilder.findEntryStep(hasWarning.id);
    }
  },

  watch:{
    'currentBroadcast.settings.categoryList'() {
      this.inGetCount = true;

      clearTimeout(countTimeout);

      countTimeout = setTimeout(() => {
        this.getTotalSubscribers();
      }, 2000);
    },

    'currentBroadcast'(broadcast) {
      if (!broadcast) return;

      this.updateBroadcastStatus()
    }
  }
}
</script>
<style lang="scss">
.broadcast-builder {
  flex-grow: 1;
  position: relative;
  background-color: #fafafa;
  width: 100%;
  height: 100%;

  .flow-builder {
    height: 100%;
  }

  .broadcast-esimating {
    animation: blink 1.5s linear infinite;
    color: #67c23a;
  }

  .broadcast-count-error {
    color: #ff0048;
  }

  .broadcast-settings {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(196, 196, 196, 0.7);
    z-index: 10;
  }

  .broadcast-settings-area {
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    margin: 0 10px;

    .broadcast-settings-controls {
      background-color: #F9F9F9;
      padding: 10px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #DBDBDB;
      border-top: 1px solid #DBDBDB;

      button {
        margin: 0 5px;
        background-color: #FFFFFF;
        border: 1px solid #B0B0B0;
        border-radius: 30px;
        color: #919191;
        padding: 0 26px;
        font-size: 13px;
        font-weight: normal;
      }

    }
  }

  .broadcast-additional-info {
    padding: 10px;
  }

  .broadcast-settings-info {
    height: 200px;
    border-bottom: 1px solid #DBDBDB;
    padding: 10px;
    display: flex;
  }

  .broadcast-chart {
    padding: 0 30px;

    .broadcast-chart-info {
      color: #828282;
      font-size: 11px;
      text-align: center;

      strong {
        font-size: 18px;
        display: block;
      }
    }
  }

  .broadcast-estimated-time {
    color: #828282;
    padding: 0 30px;
    text-align: center;
    font-size: 18px;
    line-height: normal;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .broadcast-settings-campaign-list {
    height: 100%;
    width: 250px;
    overflow: auto;
    border-right: 1px solid #DBDBDB;

    .el-checkbox__input.is-checked {
      .el-checkbox__inner {
        background-color:  #622DCE;
        border-color: #622DCE;
      }

      & + .el-checkbox__label {
        color: #622DCE;
      }
    }


    .el-checkbox {
      display: block;

      & + .el-checkbox {
        margin-left: 0;
      }
    }
  }

  .el-date-editor {
    width: 180px;
    margin: 0 5px;

    .el-input__inner {
      border-radius: 30px;
      padding: 0 20px;
      color: #622DCE;
      height: 24px;
      line-height: 24px;
    }

    .el-input__prefix {
      display: none
    }
  }

 .broadcast-builder-controls {
    display: flex;
    padding: 8px 5px 7px 13px;
    align-items: center;
    background-color: #fff;
    color: #A9A9A9;
    box-shadow: 0 2px 14px rgba(0,0,0,.1);

    span {
      font-size: 24px;
      line-height: 24px;
      flex-grow: 1;
    }

    .broadcast-warning {
      font-size: 18px;
      margin-right: 10%;
      display: flex;
      align-items: center;

      img {
        margin-right: 5px;
        width: 25px;
      }
    }

    .info {
      display: flex;
      align-items: center;
      white-space: nowrap;
      margin-right: 10px;

      & > div::first-letter {
        text-transform: uppercase;
      }

      .start-message {
        color: #67c23a;
      }

      .fail-message {
        color: #ff0048;
      }
    }

    .broadcast-builder-divider {
      border-left: 1px solid #A9A9A9;
      height: 34px;
      margin-right: 5px;
    }

    .broadcast-builder-control {
      font-size: 18px;;

      &.gear {
        padding: 8px;
        cursor: pointer;

        img {
          width: 16px;
        }
      }
    }
  }

  .broadcast-first-step {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 50px);

    .broadcast-choose-buttons {
      background-color: #fff;
      border: 1px dashed #979797;
      padding: 0 10px;
      border-radius: 5px;
    }

    .broadcast-choose-button {
      padding: 20px 90px;
      font-weight: bold;
      color: #979797;
      cursor: pointer;
      text-align: center;

      &:hover {
        color: #6A12CB;;
      }

      &:not(:last-child) {
        border-bottom: 1px dashed #979797;
      }
    }

    .broadcast-choose-info {
      color: #979797;
      font-size: 11px;
      line-height: 25px;

      &.small {
        font-size: 9px;
      }
    }
  }
}

.add-disabled-popup > * {
  opacity: .3;
  pointer-events: none;
}
</style>
