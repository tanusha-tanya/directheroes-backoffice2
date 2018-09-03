<template>
  <div class="container account" v-if="currentAccount">
    <div class="sidebar">
      <div class="account-mini-details">
        <strong>{{currentAccount.login}}</strong>
        <div>
          {{currentAccount.followerCount || 0}} Followers • {{currentAccount.followingCount || 0}} Following
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
            <div class="sub-item-name">
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
          <router-link
            class="collapse-sub-item"
            :to="{ name: 'accountThread', params: { threadId: 'all', accountId: currentAccount.id } }"
            tag="div"
           >
            <div class="sub-item-name">
              All
            </div>
            All threads
          </router-link>
          <router-link
            class="collapse-sub-item"
            :to="{ name: 'accountThread', params: { threadId: 'ignore', accountId: currentAccount.id } }"
            tag="div"
           >
            <div class="sub-item-name">
              Ignore
            </div>
            Ignored threads
          </router-link>
          <router-link
            class="collapse-sub-item"
            :to="{ name: 'accountThread', params: { threadId: 'stuck', accountId: currentAccount.id } }"
            tag="div"
           >
            <div class="sub-item-name">
              Stuck
            </div>
            Stucked threads
          </router-link>
          <router-link
            class="collapse-sub-item"
            :to="{ name: 'accountThread', params: { threadId: thread.id, accountId: currentAccount.id } }"
            v-for="thread in currentAccount.campaignList"
            :key="thread.id"
            tag="div"
           >
            <div class="sub-item-name">
              {{thread.name}}
            </div>
            {{thread.typeName}}
          </router-link>
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
        <button :disabled="!canAddCampaign(campaign.type)" class="campaign-type" v-for="campaign in campaignTypes" @click="addCompaign(campaign)">
          <div :class="[{ 'campaign-type-icon': true }, campaign.type]"></div>
          {{ campaign.name }}
        </button>
      </div>
    </el-dialog>
    <el-dialog
      v-if ="Boolean(campaignToRename)"
      :title="campaignToRename.id ? `Rename Your Campaign ${ campaignToRename.typeName }` : `Name Your New ${ campaignToRename.typeName }`"
      :visible.sync="showRenameCampaign"
      custom-class="rename-campagin-dialog"
    >
      <div class="dialog-description">
        Nam porttitor blandit accumsan. Ut vel dictum sem, a pretium dui. In malesuada enim in dolor euismod, id commodo mi consectetur. Curabitur at vestibulum nisi
      </div>
      <input v-model="newCampaignName" placeholder="Name of campaign"></input>
      <template slot="footer">
        <button :disabled="!newCampaignName" @click="renameAddCampaign">
          {{ campaignToRename.id ? 'Rename Campaign' : 'Add Campaign' }}
        </button>
      </template>
    </el-dialog>
  </div>
  <div class="loading-content"v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>
import { Collapse, CollapseItem, Dialog, Input } from 'element-ui'

const emptyTemplate = {
  name: "Template #",
  ruleList: [{
    triggerPhraseList: [],
    messageTemplate: "",
  }],
}

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
          type: 'welcomeCampaign',
          name: 'Welcome Campaign',
          templateList: [Object.assign({ type: 'welcomeOpener' }, emptyTemplate)],
        },
        {
          type: 'messageRequestCampaign',
          name: 'Message Request Campaign',
          templateList: [Object.assign({ type: "generic" }, emptyTemplate)],
        },
        {
          type: 'storyCampaign',
          name: 'Story Campaign',
          templateList: [Object.assign({ type:"storyOpener", scarcity: null, hits: 0}, emptyTemplate)],
        },
        {
          type: 'igtv',
          name: 'IGTV Campaign',
          templateList: [Object.assign({}, emptyTemplate)],
        },
        {
          type: 'ad',
          name: 'AD Campaign',
          templateList: [Object.assign({}, emptyTemplate)],
        },
        {
          type: 'broadcastCampaign',
          name: 'Broadcast Bot',
          templateList: [Object.assign({ type:"storyOpener", scarcity: null, hits: 0}, emptyTemplate)],
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
      const { dynId, uuidv4 } = this.utils;

      this.isCampaignAdd = false;

      Object.assign(campaign.templateList[0], {
        id: dynId(),
        uuid: uuidv4(),
      })

      this.$store.state.campaignToRename = {
        name: '',
        type: campaign.type,
        typeName: campaign.name,
        enabled: false,
        templateList: campaign.templateList,
      }
    },

    renameAddCampaign() {
      const { campaignToRename, currentAccount } = this;
      const { dynId, uuidv4 } = this.utils;

      campaignToRename.name = this.newCampaignName;

      if (!campaignToRename.id) {
        campaignToRename.id = dynId();
        campaignToRename.uuid = uuidv4();

        this.$store.dispatch('saveCampaigns', [campaignToRename])
          .then(({ data }) => {
            const { campaignList } = data;
            const currentCampaign = campaignList.find(campaign => campaign.uuid === campaignToRename.uuid);

            this.$message.success({
              message: 'Success add',
              duration: 3000,
              center: true
            })

            this.$router.push({ name: 'accountCampaign', params: { campaignId: currentCampaign.id, accountId: currentAccount.id } })
          })
          .catch(() => {
            this.$message.error({
              message: 'Add error',
              duration: 3000,
              center: true
            })
          });
      }

      this.showRenameCampaign = null;
    },

    canAddCampaign(campaignType) {
      const { campaignList } = this.currentAccount;

      switch(campaignType) {
        case 'ad':
        case 'igtv':
        case 'broadcastCampaign':
          return false;
        break;
        case 'messageRequestCampaign':
        case 'welcomeCampaign':
          return !campaignList.some(campaign => ['messageRequestCampaign', 'welcomeCampaign'].includes(campaign.type));
      }

      return true;
    },
  },

  watch: {
    showRenameCampaign() {
      this.newCampaignName = this.campaignToRename ? this.campaignToRename.name : '';
    },

    '$store.state.accounts'() {
      if (this.currentAccount) return;

      this.selectAccount(this.$route);
    },
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

        .sub-item-name {
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
        background-color: transparent;
        color: #0C0033;
        font-weight: normal;
        padding: 0;
      }

      .campaign-type-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 7px;
        opacity: .5;

        &.welcomeCampaign {
          background-image: url(../assets/folder.svg);
        }

        &.messageRequestCampaign {
          background-image: url(../assets/comment.svg);
        }

        &.storyCampaign {
          background-image: url(../assets/copy.svg);
        }

        &.igtv {
          background-image: url(../assets/bell.svg);
        }

        &.ad {
          background-image: url(../assets/cart.svg);
        }

        &.broadcastCampaign {
          background-image: url(../assets/heart.svg);
        }
      }
    }

    .rename-campagin-dialog {
      input {
        margin-top: 42px;
      }
    }
  }
</style>