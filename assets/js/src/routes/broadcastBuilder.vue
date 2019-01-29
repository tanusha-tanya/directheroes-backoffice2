<template>
<div class="broadcast-builder">
  <div class="broadcast-builder-controls">
    <span>Broadcast Builder</span>
    <div class="broadcast-builder-divider" v-if="currentBroadcast"></div>
    <div class="broadcast-builder-control gear" v-if="currentBroadcast" @click="isSettings = !isSettings">
      <img src="../assets/svg/gear.svg"/>
    </div>
  </div>
  <div class="broadcast-builder-area" v-if="currentBroadcast">
    <broadcast-card :broadcast="currentBroadcast"></broadcast-card>
  </div>
  <builder-elements type="broadcast"></builder-elements>
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
            :picker-options="pickerOptions"
            placeholder="Select date and time">
          </el-date-picker>
        or:
          <button @click="setNowDate">Broadcast now</button>
      </div>
      <div class="broadcast-settings-info">
        <div class="broadcast-settings-campaign-list">
          <el-checkbox
            v-for="subscriber in account.subscriberCategoryList"
            :key="subscriber.id"
            :checked="isCheckedSubscriber(subscriber.id)"
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
import builderElements from '../component/builderElements.vue'
import broadcastCard from '../component/builder-cards/broadcastCard.vue'
import debounce from 'lodash/debounce'
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    }
  },

  components: {
    builderElements,
    broadcastCard
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

        console.log(startAt);


        return typeof startAt == 'number' ? startAt * 1000 : startAt
      },
      set(value) {
        const { settings } = this.broadcastStep;

        Vue.set(settings, 'startAt', moment(value).utc().format());
        settings.startTimeSetAt = moment().utc().format();
      }
    }
  },

  methods: {
    setCurrentBroadcast(route) {
      const { broadcastId } = route.params;
      const { broadcastList } = this.$store.state.currentAccount;
      const currentBroadcast = broadcastList.find(broadcast => broadcast.id == broadcastId);

      this.currentBroadcast = currentBroadcast;
    },

    saveBroadcast: debounce(function() {
      this.$store.dispatch('saveCampaign', this.currentBroadcast)
        .catch(() => {
          this.$message.error({
            message: 'Could not save data',
            duration: 3000,
            center: true
          })
        });
    }, 3000),

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
      this.startAt = moment().utc().format()
    }
  },

  watch:{
    '$store.state.accounts'() {
      if (this.currentBroadcast) return;

      this.setCurrentBroadcast(this.$route);
    },
    currentBroadcast: {
      handler: function (broadcast, oldBroadcast) {
        if (!oldBroadcast || !broadcast || broadcast.id !== oldBroadcast.id) return;

        this.saveBroadcast();
      },
      deep: true
    },
  }
}
</script>
<style lang="scss">
.broadcast-builder {
  width: 100%;
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

}
</style>
