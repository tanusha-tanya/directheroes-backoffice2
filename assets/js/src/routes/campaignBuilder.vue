<template>
  <div class="campaign-builder">
    <div class="campaign-builder-controls">
      <span>Campaign Builder</span>
      <div class="campaign-warning" v-if="currentCampaign && hasWarning"><img src="../assets/triangle.svg">This flow is incomplete</div>
      <div class="campaign-builder-control" v-if="currentCampaign" >
        Activate
        <template v-if="hasWarning">
          <el-tooltip
            effect="light"
            content="Please clear all warnings first"
            >
            <el-switch v-model="currentCampaign.isEnabled" :width="22" :disabled="true"></el-switch>
          </el-tooltip>
        </template>
        <template v-else>
          <el-switch v-model="currentCampaign.isEnabled" :width="22" :disabled="hasWarning"></el-switch>
        </template>
      </div>
      <div class="campaign-builder-divider" v-if="currentCampaign"></div>
      <el-popover class="campaign-builder-control" placement="bottom" trigger="hover" v-if="currentCampaign">
        <div class="campaign-builder-settings">
          <div class="campaign-builder-option">
            <el-switch v-model="currentCampaign.settings.allowReEnter" :width="22"></el-switch> Allow Re-entering campaign
          </div>
          <div class="campaign-builder-option trash" @click="isDeleteDialog = true">
            <img src="../assets/svg/trash.svg"/> Delete campaign
          </div>
        </div>
        <div class="gear" slot="reference">
          <img src="../assets/svg/gear.svg"/>
        </div>
      </el-popover>
    </div>
    <flow-builder entry-type="campaignEntry" :current-entry-item="currentCampaign" :has-warning="hasWarning"></flow-builder>
    <confirm-dialog
      v-model="isDeleteDialog"
      title="Delete campaign"
      message="Are you sure you want to delete campaign?"
      @success="deleteCampaign"
      >
    </confirm-dialog>
  </div>
</template>
<script>
import ObjectId from '../utils/ObjectId'
import utils from '../utils'
import flowBuilder from '../component/flowBuilder.vue'
import confirmDialog from '../component/confirmDialog.vue'

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
      isDeleteDialog: false
    }
  },

  components: {
    flowBuilder,
    confirmDialog
  },

  computed:{
    campaigns() {
      return this.$store.state.currentAccount.campaignList
    },

    hasWarning() {
      const { currentCampaign } = this;

      if (!currentCampaign) return;

      return utils.hasCampaignWarning(currentCampaign);
    }
  },

  methods: {
    setCurrentCampaign(route) {
      let { campaignId } = route.params;
      const { campaignList } = this.$store.state.currentAccount;

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

          this.$router.replace({ name: 'accountCampaignList', params: { accountId: currentAccount.id } })
        })
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
.campaign-builder-settings {
  color: #A9A9A9;

  .el-switch {
    margin-right: 10px;
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

  .campaign-builder-option {
    display: flex;
    align-items: center;
    padding: 10px;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(#A9A9A9, .2);
    }

    &.trash {
      cursor: pointer;

      img {
        margin-right: 10px;
      }
    }
  }
}

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
      flex-grow: 1;
    }

    .campaign-warning {
      font-size: 18px;
      margin-right: 10%;
      display: flex;
      align-items: center;

      img {
        margin-right: 5px;
        width: 25px;
      }
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

    span.campaign-builder-control {
      flex-grow: 0;
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

      .gear {
        padding: 0 8px;
        display: flex;
        cursor: pointer;
        align-items: center;

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
