<template>
<div class="broadcast-builder">
  <div class="broadcast-builder-controls">
    <span>Broadcast Builder</span>
     <div class="info" v-if="currentBroadcast">
        <div class="start-message" v-if="timeToStart">{{ timeToStart }}</div>
        <div class="fail-message" v-if="notStarted">Campaign didn't start</div>
        <div class="start-message" v-else-if="!timeToStart && !isStarted && !notStarted && startAt">Prepare to start</div>
        <div class="start-message" v-if="isStarted">Broadcast was started</div>
        <div v-if="!startAt">Time to start not setted</div>
      </div>
    <div class="broadcast-builder-divider" v-if="currentBroadcast"></div>
    <div class="broadcast-builder-control gear" v-if="currentBroadcast" @click="isSettings = !isSettings">
      <img src="../assets/svg/gear.svg"/>
    </div>
  </div>
  <flow-builder entry-type="broadcastEntry" :current-entry-item="currentBroadcast" v-if="currentBroadcast" :disabled="isStarted || notStarted"></flow-builder>
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
            :disabled="isStarted || notStarted"
            :picker-options="pickerOptions"
            placeholder="Select date and time">
          </el-date-picker>
        or:
          <button @click="setNowDate" :disabled="isStarted || notStarted">Broadcast now</button>
      </div>
      <div class="broadcast-settings-info">
        <div class="broadcast-settings-campaign-list">
          <el-checkbox
            v-for="subscriber in account.subscriberCategoryList"
            :key="subscriber.id"
            :checked="isCheckedSubscriber(subscriber.id)"
            :disabled="isStarted || notStarted"
            @change="checkSubscriber(subscriber, $event)"
            >
            {{ subscriber.name }}
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import flowBuilder from '../component/flowBuilder.vue'
import moment from 'moment'
import Vue from 'vue'

export default {
  beforeRouteEnter(to, from, next) {
    next(accountBroadcast => {
      accountBroadcast.setCurrentBroadcast(to);
    })
  },

  beforeRouteUpdate(to, from, next) {
    this.currentBroadcast = null;

    this.setCurrentBroadcast(to);
    next();
  },

  data() {
    return {
      currentBroadcast: null,
      isSettings: false,
      timeToStart: null,
      broadcastTimeout: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    }
  },

  components: {
    flowBuilder
  },

  computed: {
    account() {
      return this.$store.state.currentAccount;
    },

    broadcastStep() {
      return this.currentBroadcast.steps.find(step => step.type = 'broadcastEntry')
    },

    startAt: {
      get() {
        const { startAt } = this.broadcastStep.settings;

        return typeof startAt == 'number' ? startAt * 1000 : startAt
      },
      set(value) {
        const { settings } = this.broadcastStep;

        Vue.set(settings, 'startAt', moment(value).utc().format());
        settings.startTimeSetAt = moment().utc().format();

        this.updateBroadcastStatus();
      }
    },

    isStarted() {
      const { broadcastStep } = this
      return broadcastStep.status.statusText == 'running'
    },

    notStarted() {
      const { isStarted, startAt, broadcastStep } = this;

      return !isStarted && startAt && moment().diff(new Date(startAt), 'minutes') > 1
    }
  },

  methods: {
    setCurrentBroadcast(route) {
      const { broadcastId } = route.params;
      const { broadcastList } = this.$store.state.currentAccount;
      const currentBroadcast = broadcastList.find(broadcast => broadcast.id == broadcastId);

      this.currentBroadcast = currentBroadcast;

      this.updateBroadcastStatus()
    },

    checkSubscriber(subscriber, checked) {
      const { categoryList } = this.broadcastStep.settings;

      if (checked) {
        categoryList.push(subscriber);
      } else {
        categoryList.splice(categoryList.indexOf(categoryList.find(customer => customer.id === subscriber.id)), 1)
      }
    },

    isCheckedSubscriber(id) {
      return (this.broadcastStep.settings.categoryList).some(subscriber => subscriber.id == id)
    },

    setNowDate() {
      const { broadcastStep } = this;

      broadcastStep.status.statusText = 'running'
      this.startAt = moment().utc().format()
    },

    updateBroadcastStatus() {
      const { isStarted, startAt, broadcastStep, notStarted } = this;
      const diff = moment(new Date(startAt)).diff();
      let timeout = 60 * 1000;

      clearTimeout(this.broadcastTimeout)

      this.timeToStart = (!startAt || moment().diff(new Date(startAt)) > 0) ? null : `${moment().from(new Date(startAt), true)} to start`

      if ((diff > 60 * 60 * 1000) || isStarted || notStarted) return;

      if (diff < 60 * 1000 && diff > 0) {
        timeout = 1000;
      } else if (!this.timeToStart) {
        return;
      }

      this.broadcastTimeout = setTimeout(this.updateBroadcastStatus.bind(this), timeout)
    },
  },

  watch:{
    '$store.state.accounts'() {
      if (this.currentBroadcast) return;

      this.setCurrentBroadcast(this.$route);
    },
  }
}
</script>
<style lang="scss">
.broadcast-builder {
  flex-grow: 1;
  position: relative;

  .broadcast-settings {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(196, 196, 196, 0.7);
    z-index: 5;
  }

  .broadcast-settings-area {
    background-color: #fff;
    padding-bottom: 20px;
    border-radius: 0 0 10px 10px;
    margin: 0 10px;
  }

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

  .broadcast-settings-info {
    height: 200px;
    border-bottom: 1px solid #DBDBDB;
    padding: 10px;
  }

  .broadcast-settings-campaign-list {
    height: 100%;
    width: 200px;
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
    justify-content: space-between;
    background-color: #fff;
    color: #A9A9A9;

    span {
      font-size: 24px;
      line-height: 24px;
      flex-grow: 1;
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
      font-size: 18px;

      &.gear {
        padding: 8px;
        cursor: pointer;

        img {
          width: 16px;
        }
      }
    }
  }

  .flow-builder {
    height: calc(100% - 50px);
  }
}
</style>
