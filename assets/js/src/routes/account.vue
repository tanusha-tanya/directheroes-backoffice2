<template>
  <div class="container account">
    <div class="sidebar">
      <div class="account-mini-details">
        <strong>{{currentAccount.name}}</strong>
        <div>
          {{currentAccount.followers}} Followers • {{currentAccount.following}} Following
        </div>
      </div>
      <el-collapse accordion>

        <router-link
          class="el-collapse-item"
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
        <el-collapse-item>
          <template slot="title">
            <span>
              <img src="../assets/copy.svg"/>
              Compaign Builder
            </span>
          </template>
          <router-link
            class="collapse-sub-item"
            :to="{ name: 'accountCompaign', params: { compaignId: compaign.id, accountId: currentAccount.id } }"
            v-for="compaign in currentAccount.compaigns"
            :key="compaign.id"
            tag="div"
          >
            <div class="compaign-name">
              {{compaign.name}}
            </div>
            {{compaign.type}}
          </router-link>
        </el-collapse-item>
        <el-collapse-item>
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
  </div>
</template>
<script>
import { Collapse, CollapseItem } from 'element-ui'

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

  computed: {
    currentAccount() {
      return this.$store.state.currentAccount;
    }
  },

  components: {
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem
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

    .el-collapse-item {
      border-left: 3px solid transparent;
      border-bottom: 1px solid #e6e6e6;
      opacity: .5;
      cursor: pointer;

      &:hover {
        opacity: .8;
      }

      .el-collapse-item__arrow {
        order: 2;
        background-image: url(../assets/arrow.svg);
        width: 24px;
        height: 24px;
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

        .compaign-name {
          font-weight: bold;
        }
      }
    }
  }
</style>