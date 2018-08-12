<template>
  <div class="container account" v-if="currentAccount">
    <div class="sidebar">
      <div class="account-mini-details">
        <strong>{{currentAccount.login}}</strong>
        <div>
          {{currentAccount.followerCount}} Followers • {{currentAccount.followingCount}} Following
        </div>
      </div>
      <el-collapse class="account-menu" accordion>
        <router-link
          class="account-menu-item"
          :to="{ name: 'accountCurrent', params: { accountId: currentAccount.id || 0 } }"
          tag="div"
        >
          <div class="el-collapse-item__header">
            <i class="el-collapse-item__arrow"></i>
            <span>
              <img src="../assets/details.svg">
              Instagram Account Details
            </span>
          </div>
        </router-link>
        <!-- <el-collapse-item>
          <template slot="title">
            <span>
              <img src="../assets/details.svg"/>
              Instagram Account Details
            </span>
          </template>
        </el-collapse-item> -->
        <el-collapse-item class="account-menu-item">
          <template slot="title">
            <span>
              <img src="../assets/copy.svg"/>
              Campaign Builder
            </span>
          </template>
          <router-link
            class="collapse-sub-item"
            :to="{ name: 'accountCampaign', params: { campaignId: campaign.id, accountId: currentAccount.id } }"
            v-for="campaign in currentAccount.campaignList"
            :key="campaign.id"
            tag="div"
          >
            <div class="campaign-name">
              {{campaign.name}}
            </div>
            {{campaign.typeName}}
          </router-link>
          <div class="add-campaign-button" @click="isCampaignAdd = true">
            + Add campaign
          </div>
        </el-collapse-item>
        <el-collapse-item class="account-menu-item">
          <template slot="title">
            <span>
              <img src="../assets/comment.svg"/>
              Threads
            </span>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
    <el-dialog title="Add New Campaign":visible.sync="isCampaignAdd" custom-class="add-campagin-dialog">
      <div class="dialog-description">
        What kind of campaign are you adding?
      </div>
      <div class="campaign-list">
        <div class="campaign-type" v-for="campaign in campaignTypes" @click="addCompaign(campaign)">
          <div :class="[{ 'campaign-type-icon': true }, campaign.type]"></div>
          {{ campaign.name }}
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-if ="Boolean(campaignToRename)"
      :title="campaignToRename.id ? `Rename Your Campaign ${ campaignToRename.type }` : `Name Your New ${ campaignToRename.type }`"
      :visible.sync="showRenameCampaign"
      custom-class="rename-campagin-dialog"
    >
      <div class="dialog-description">
        Nam porttitor blandit accumsan. Ut vel dictum sem, a pretium dui. In malesuada enim in dolor euismod, id commodo mi consectetur. Curabitur at vestibulum nisi
      </div>
      <el-input v-model="newCampaignName" placeholder="Name of campaign"></el-input>
      <template slot="footer">
        <div :class="{ 'dialog-button': true, disabled: !newCampaignName}" @click="renameAddCampaign">
          {{ campaignToRename.id ? 'Rename Campaign' : 'Add Campaign' }}
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { Collapse, CollapseItem, Dialog, Input } from 'element-ui'

export default {
  beforeRouteEnter(to, from, next) {
    next(accountComponent => {
      accountComponent.selectAccount(to);
    });
  },

  beforeRouteUpdate(to, from, next) {
    this.selectAccount(to);
    next();
  },

  data() {
    return {
      newCampaignName: '',
      isCampaignAdd: false,
      campaignTypes: [
        {
          type: 'welcome',
          name: 'Welcome Campaign',
          dataTemplate: {
            rules:[]
          }
        },
        {
          type: 'message',
          name: 'Message Request Campaign',
          dataTemplate: {
            rules:[]
          }
        },
        {
          type: 'story',
          name: 'Story Campaign',
          dataTemplate: {
            rules:[]
          }
        },
        {
          type: 'igtv',
          name: 'IGTV Campaign',
          dataTemplate: {
            rules:[]
          }
        },
        {
          type: 'ad',
          name: 'AD Campaign',
          dataTemplate: {
            rules:[]
          }
        },
        {
          type: 'broadcast',
          name: 'Broadcast Bot',
          dataTemplate: {
            rules:[]
          }
        },
      ]
    }
  },

  computed: {
    currentAccount() {
      return this.$store.state.currentAccount;
    },

    campaignToRename() {
      return this.$store.state.campaignToRename;
    },

    showRenameCampaign: {
      get() {
        return  Boolean(this.campaignToRename);
      },
      set() {
        this.$store.state.campaignToRename = null;
      }
    }
  },

  components: {
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem,
    'el-dialog': Dialog,
    'el-input': Input,
  },

  methods: {
    selectAccount(route) {
      const { $store } = this
      const { accounts } = $store.state
      const { accountId } = route.params

      if (accountId) {
        $store.commit('selectAccount', accounts.find(account => account.id == accountId))
      } else {
        $store.commit('selectAccount', accounts[0]);
      }
    },

    addCompaign(campaign) {
      this.isCampaignAdd = false;
      this.$store.state.campaignToRename = {
        name: '',
        type: campaign.name,
        active: false,
        templates: [campaign.dataTemplate]
      }
    },

    renameAddCampaign() {
      const { campaignToRename, currentAccount } = this;

      campaignToRename.name = this.newCampaignName;

      if (!campaignToRename.id) {
        campaignToRename.id = currentAccount.campaigns.length + 10;
        currentAccount.campaigns.push(campaignToRename)

        this.$router.push({ name: 'accountCampaign', params: { campaignId: campaignToRename.id, accountId: currentAccount.id } })
      }

      this.showRenameCampaign = null
    }
  },

  watch: {
    showRenameCampaign() {
      this.newCampaignName = this.campaignToRename ? this.campaignToRename.name : '';
    },
    '$store.state.accounts'() {
      if (this.currentAccount) return;

      this.selectAccount(this.$route);
    }
  }
}
</script>
<style lang="scss">
  .account {
    .sidebar {
      background-color: #F5F5F5;
      border-right: 1px solid #e6e6e6;
    }

    .account-mini-details {
      padding: 16px;
      border-bottom: 1px solid #e6e6e6;
      background-color: #EEEEEE;
      border-right: 1px solid #EEEEEE;
      margin-right: -1px;
    }

    .account-menu-item {
      border-left: 3px solid transparent;
      border-bottom: 1px solid #e6e6e6;
      opacity: .5;
      cursor: pointer;
      transition: .2s opacity;

      &:hover {
        opacity: .8;
      }

      .el-collapse-item__arrow {
        order: 2;
        background-image: url(../assets/arrow.svg);
        width: 24px;
        height: 24px;
        transition: .2s transform;
      }

      &.router-link-exact-active {
        background-color: #EEEEEE;
        border-left-color: #434890;
        opacity: 1;
      }

      &.is-active {
        background-color: #EEEEEE;
        border-left-color: #434890;
        opacity: 1;

        .el-collapse-item__arrow {
          transform: rotate(90deg);
        }
      }

      .el-collapse-item__header {
        padding: 12px 0 12px 16px;
        outline: none;
        display: flex;
        justify-content: space-between;
        align-items: center;

        & > span {
          display: flex;
          align-items: center;
        }
      }

      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        opacity: .5;
      }

      .el-collapse-item__wrap {
        will-change: height;
        transition: .2s height ease-out;
      }
    }

    .collapse-sub-item {
      padding: 10px 10px 10px 45px;
      opacity: .5;

      &:hover {
        opacity: .8;
      }

      &.router-link-active {
        background-color: #DEDDE1;
        opacity: 1;

        .campaign-name {
          font-weight: bold;
        }
      }
    }

    .add-campaign-button {
      color: #85539C;
      font-weight: 600;
      padding: 15px 15px 15px 45px;
    }

    .add-campagin-dialog {
      .el-dialog__header {
        align-items: flex-start;
      }

      .el-dialog__title {
        text-align: center;
      }
    }

    .campaign-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      margin: 26px 0;

      .campaign-type {
        width: 150px;
        font-size: 14px;
        line-height: 20px;
        margin:25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      }

      .campaign-type-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 7px;
        opacity: .5;

        &.welcome {
          background-image: url(../assets/folder.svg);
        }

        &.message {
          background-image: url(../assets/comment.svg);
        }

        &.story {
          background-image: url(../assets/copy.svg);
        }

        &.igtv {
          background-image: url(../assets/bell.svg);
        }

        &.ad {
          background-image: url(../assets/cart.svg);
        }

        &.broadcast {
          background-image: url(../assets/heart.svg);
        }
      }
    }

    .rename-campagin-dialog {
      .el-input {
        margin-top: 42px;
      }
    }
  }
</style>