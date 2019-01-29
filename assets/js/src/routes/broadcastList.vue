<template>
<div class="broadcast-list w968">
  <div class="content-title">Broadcasts</div>
  <div class="broadcast-controls">
    <span></span>
    <button @click="isAddBroadcast = true">+ New Broadcast</button>
  </div>
  <div class="container-area">
    <div class="list-item header">
      <div class="broadcast-row">Broadcast Name</div>
      <div class="schedule-row">Scheduled Start</div>
      <div class="complete-row">Completed At</div>
      <div class="reach-row">Reach</div>
      <div class="status-row">Status</div>
    </div>
    <router-link class="list-item" :to="{name: 'accountBroadcast', params:{ broadcastId:broadcast.id }}" v-for="broadcast in account.broadcastList" :key="broadcast.id">
      <div class="broadcast-row">
        {{ broadcast.name }}
      </div>
      <div class="schedule-row">
        {{ broadcastSchedule(broadcast) }}
      </div>
      <div class="complete-row">
        {{ broadcastCompleteAt(broadcast) }}
      </div>
      <div class="reach-row">
        {{ broadcastReach(broadcast) }}
      </div>
      <div class="status-row">
        {{ broadcastStatus(broadcast) }}
      </div>
    </router-link>
  </div>
   <el-dialog
    :visible.sync="isAddBroadcast"
    title="Create New Broadcast"
    class="campaign-dialog"
    width="321px"
    append-to-body
    :show-close="false"
    >
    <input v-model="newBroadcastName" placeholder="Enter Broadcast name"/>
    <template slot="footer">
      <button @click="createBroadcast">Create</button>
      <button class="cancel" @click="isAddBroadcast = false">Close</button>
    </template>
  </el-dialog>
</div>    
</template>
<script>
import moment from 'moment'

export default {
  data() {
    return {
      isAddBroadcast: false,
      newBroadcastName: ''
    }
  },

  computed: {
    account() {
      return this.$store.state.currentAccount
    }
  },

  methods: {
    createBroadcast() {
      const { currentAccount } = this.$store.state;

      this.$store.dispatch('createBroadcast', {
        name: this.newBroadcastName
      }).then(({ data }) => {
        const { campaign } = data;

        this.isAddBroadcast = false;
        this.newBroadcastName = '';

        this.$router.push({ name: 'accountBroadcast', params: { broadcastId: campaign.id, accountId: currentAccount.id } })
      })
    },

    broadcastSchedule(broadcast) {
      const broadcastEntry = broadcast.steps.find(step => step.type == 'broadcastEntry')
      const { settings } = broadcastEntry;
      const startAt = moment((settings.startAt && settings.startAt * 1000) || null).format('DD MMM YYYY hh:mm')
      
      return startAt == 'Invalid date' ? '-' : startAt;
    },

    broadcastCompleteAt(broadcast) {
      const broadcastEntry = broadcast.steps.find(step => step.type == 'broadcastEntry')
      const { status } = broadcastEntry;
      const completedAt = moment((status.completedAt && status.completedAt * 1000) || null).format('DD MMM YYYY hh:mm')

      return completedAt == 'Invalid date' ? '-' : completedAt;
    },

    broadcastReach(broadcast) {
      const broadcastEntry = broadcast.steps.find(step => step.type == 'broadcastEntry')
     
      return broadcastEntry.status.reach || '-';
    },

    broadcastStatus(broadcast) {
      const broadcastEntry = broadcast.steps.find(step => step.type == 'broadcastEntry')
     
      return broadcastEntry.status.statusText;
    }
  },
}
</script>
<style lang="scss">
.broadcast-list {
  padding: 15px 0;

  .content-title {
    margin-bottom: 16px;
  }

  .broadcast-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;

    button {
      border-radius: 50px;
      background-color: #6A12CB;
      padding: 5px 26px;
    }
  }

  .list-item {
    text-decoration: none;
    
    &.header {
      font-weight: bold;
      // justify-content: space-between;

      &:hover {
        background-color: transparent
      } 
    }

    .broadcast-row {
      width: 32%;
      padding: 0 10px;
      flex-shrink: 0;
    }

    .schedule-row {
      width: 17%;
      padding: 0 10px;
      flex-shrink: 0;
    }

    .complete-row {
      width: 17%;
      padding: 0 10px;
      flex-shrink: 0;
    }

    .reach-row {
      width: 17%;
      padding: 0 10px;
      flex-shrink: 0;
    }

    .status-row {
      width: 17%;
      padding: 0 10px;
      flex-shrink: 0;
    }
  }
}

.el-dialog__wrapper.campaign-dialog {

  .el-dialog {
    border-radius: 5px;
    padding: 20px;
  }

  .el-dialog__header {
    padding: 0;
    font-size: 18px;
    line-height: 22px;
    font-weight: bold;
    text-align: center;
  }

  .el-dialog__body {
    padding: 0;

    input:not(.el-input__inner) {
      width: 100%;
      margin: 20px 0;
      font-size: 15px;
      line-height: 18px;
      padding: 4px 10px 6px;
      border: 1px solid #DBDBDB;

      &::placeholder {
        color: #A9A9A9;
        text-align: center;
      }
    }
  }

  .el-dialog__footer {
    padding: 0;

    button {
      background-color: #6A12CB;
      border-radius: 5px;
      line-height: 16px;
      font-weight: normal;
      padding: 7px 20px;

      &.cancel {
        background-color: transparent;
        color: #000;
      }
    }
  }
}
</style>
