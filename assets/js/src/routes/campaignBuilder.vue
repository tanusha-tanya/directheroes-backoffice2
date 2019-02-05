<template>
  <div class="campaign-builder">
    <div class="campaign-builder-controls">
      <span>Campaign Builder</span>
      <div class="campaign-list">
        <el-select
          size="small"
          :value="currentCampaign && currentCampaign.id"
          @change="selectCampaign"
          placeholder="Select Add new campaign"
        >
          <el-option
            v-for="campaign in campaigns"
            :label="campaign.name" :value="campaign.id"
            :key="campaign.id"
            >
          </el-option>
          <el-option
            label="+ Add new campaign"
            value="new"
            >
          </el-option>
        </el-select>
      </div>
      <div class="campaign-builder-control" v-if="currentCampaign">
        Activate
        <el-switch v-model="currentCampaign.isEnabled" :width="22"></el-switch
      ></div>
      <div class="campaign-builder-divider" v-if="currentCampaign"></div>
      <div class="campaign-builder-control trash" v-if="currentCampaign" @click="deleteCampaign">
        <img src="../assets/svg/trash.svg"/>
      </div>
    </div>
    <flow-builder entry-type="campaignEntry" :current-entry-item="currentCampaign"></flow-builder>
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
import ObjectId from '../utils/ObjectId'
import flowBuilder from '../component/flowBuilder.vue'

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
      isAddCampaign: false,
      newCampaignName: ''
    }
  },

  components: {
    flowBuilder
  },

  computed:{
    campaigns() {
      return this.$store.state.currentAccount.campaignList
    }
  },

  methods: {
    setCurrentCampaign(route) {
      let { campaignId } = route.params;
      const { campaignList } = this.$store.state.currentAccount;

      if (!campaignList || !campaignList.length) {
        this.isAddCampaign = true;
        return
      };

      if (!campaignId) {
        campaignId = campaignList[0].id;
      };

      if (!campaignId) return;

      const currentCampaign = campaignList.find(campaign => campaign.id == campaignId);

      currentCampaign.steps.forEach(step => {
        if (step.displaySettings) return;

        Object.assign(step, {
          displaySettings: {
            positionX: null,
            positionY: null,
            collapsed: false
          }
        })
      })

      if (currentCampaign) {
        this.currentCampaign = currentCampaign;
      } else {
        this.$store.dispatch('getCampaignTemplates', { campaign:currentCampaign })
          .then(({ data }) => {
            this.currentCampaign = data.campaign;
          });
      }
    },

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

        })
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

    selectCampaign(campaignId) {
      const { currentAccount } = this.$store.state;

      if (campaignId == 'new') {
        this.isAddCampaign = true;
        return;
      }

      this.$router.push({ name: 'accountCampaign', params: {campaignId,  accountId: currentAccount.id }})
    },
  },

  watch:{
    '$store.state.accounts'() {
      if (this.currentCampaign) return;

      this.setCurrentCampaign(this.$route);
    }
  }
}
</script>
<style lang="scss">
.campaign-builder {
  flex-grow: 1;
  position: relative;

  .campaign-builder-controls {
    display: flex;
    padding: 8px 5px 7px 13px;
    align-items: center;
    background-color: #fff;
    color: #A9A9A9;

    span {
      font-size: 24px;
      line-height: 24px;
    }

    .campaign-list {
      flex-grow: 1;
      text-align: center;

      .el-select {
        width: 100%;
        max-width: 300px;
      }
    }

    .campaign-builder-divider {
      border-left: 1px solid #A9A9A9;
      height: 34px;
      margin: 0 10px 0 38px;
    }

    .campaign-builder-control {
      font-size: 18px;

      .el-switch {
        margin-left: 14px;

        .el-switch__core {
          height: 14px;
          background-color: transparent;
          border: 2px solid currentColor;

          &:after {
            border: 2px solid currentColor;
            width: 4px;
            height: 4px;
            left: 2px;
          }
        }

        &.is-checked {
          .el-switch__core {
            border-color: #2E69F7;

            &:after {
              border-color: #2E69F7;
              left:100%;
              margin-left: -10px;
            }
          }
        }
      }

      &.trash {
        padding: 8px;
        cursor: pointer;
      }
    }
  }

  .flow-builder {
    height: calc(100% - 50px);
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
