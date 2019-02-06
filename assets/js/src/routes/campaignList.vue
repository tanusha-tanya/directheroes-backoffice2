<template>
<div class="campaign-list w968">
  <div class="content-title">Campaigns</div>
  <div class="campaign-controls">
    <span></span>
    <button @click="isAddCampaign = true">+ New Campaign</button>
  </div>
  <div class="container-area">
    <div class="list-item header">
      <div class="campaign-row">Campaign Name</div>
      <div class="active-row">Status</div>
    </div>
    <router-link class="list-item" :to="{name: 'accountCampaign', params:{ campaignId:campaign.id }}" v-for="campaign in account.campaignList" :key="campaign.id">
      <div class="campaign-row">
        {{ campaign.name }}
      </div>
      <div class="active-row">
        {{campaign.isEnabled ? 'Active' : 'Not Active'}}
      </div>
      <div class="delete-row">
        <div class="trash-button" @click.stop.prevent="deleteCampaign(campaign)">
          <img src="../assets/svg/trash.svg"/>
        </div>
      </div>
    </router-link>
  </div>
    <el-dialog
      :visible.sync="isAddCampaign"
      title="Create New Campaign"
      class="campaign-dialog"
      width="321px"
      append-to-body
      :show-close="false"
      >
      <input v-model="newCampaignName" placeholder="Enter Campaign name"/>
      <template slot="footer">
        <button @click="createCampaign">Create</button>
        <button class="cancel" @click="isAddCampaign = false">Close</button>
      </template>
    </el-dialog>
</div>    
</template>
<script>
import moment from 'moment'

export default {
  data() {
    return {
      isAddCampaign: false,
      newCampaignName: ''
    }
  },

  computed: {
    account() {
      return this.$store.state.currentAccount
    }
  },

  methods: {
    deleteCampaign(campaign) {
      this.$store.dispatch('deleteCampaign', campaign)
    },

    createCampaign() {
      const { currentAccount } = this.$store.state;

      this.$store.dispatch('createCampaign', {
        name: this.newCampaignName
      }).then(({ data }) => {
        const { campaign } = data;

        this.isAddCampaign = false;
        this.newCampaignName = '';

        this.$router.push({ name: 'accountCampaign', params: { campaignId: campaign.id, accountId: currentAccount.id } })
      })

    },
  },
}
</script>
<style lang="scss">
.campaign-list {
  padding: 15px 0;

  .content-title {
    margin-bottom: 16px;
  }

  .campaign-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;

    button {
      border-radius: 50px;
      background-color: #6A12CB;
      padding: 5px 26px;
    }
  }

  .container-area {
    min-height: 75vh;
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

    .campaign-row {
      width: 60%;
      padding: 0 10px;
      flex-shrink: 0;
    }

    .active-row {
      width: 20%;
      padding: 0 10px;
      flex-shrink: 0;
    }

    .delete-row {
      width: 20%;
      text-align: right;
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
