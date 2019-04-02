<template>
  <div class="account-dh-subscriton">
    <div class="content-title">My subscriptions</div>
    <div class="account-dh-subscription-controls">
      <button>+ Add new account</button>
    </div>
    <div class="list-item header">
      <div class="account-row">Account</div>
      <div class="subscriprion-row">Subscription</div>
      <div class="followers-row">Followers</div>
      <div class="renewalat-row">Renewal at</div>
    </div>
    <template v-if="subscriptions">
      <template v-if="subscriptions.length">
        <div class="list-item" v-for="subscription in subscriptions" :key="subscription.id" @click="accountToView = subscription">
          <div class="account-row">
            <div class="account-avatar" :style="{'background-image': `url(${ subscription.profilePicUrl })`}"></div>
            <div>
              {{ subscription.fullName }}
              <div class="account-login">
                {{ subscription.login }}
              </div>
            </div>
          </div>
          <div class="subscriprion-row">
            <div :class="[{'subscription-type': true}, subscription.type]">
              {{ subscription.type || 'FREE' }}
            </div>
          </div>
          <div class="followers-row">{{ subscription.followerCount || 0 }}</div>
          <div class="renewalat-row">Renewal at</div>
        </div>
      </template>
      <div class="no-result" v-else>
        No subscription found
      </div>
    </template>
    <div class="loading-content" v-else>
      <div class="pre-loader"></div>
    </div>
    <el-dialog
      :visible.sync="isAccountToView"
      width="207px"
      append-to-body
      class="subscription-dialog"
      :show-close="false"
      >
        <div class="account-dh-info" v-if="accountToView">
          <div class="account-dh-photo" :style="{'background-image': `url(${ accountToView.profilePicUrl || igAvatar })`}"></div>
          <div class="account-dh-name">
            {{accountToView.fullName}}
          </div>
          <div class="account-dh-login">
            {{accountToView.login}}
          </div>
          <div class="account-plan">
            <span>Subscription plan</span>
            <div :class="[{'subscription-type': true}, accountToView.type]">
              {{ accountToView.type || 'FREE' }}
            </div>
          </div>
          <div class="account-dh-joined">
            Joined: <strong>Aug 1st, 2018</strong>
          </div>
          <button>Cancel account</button>
          <!-- <button>Delete account</button> -->
        </div>
    </el-dialog>
  </div>
</template>
<script>
import igAvatar from '../assets/ig-avatar.jpg'

export default {
  data() {
    return {
      subscriptions: null,
      accountToView: null,
    }
  },

  computed: {
    isAccountToView:{
      get() {
        return Boolean(this.accountToView)
      },
      set(value) {
        this.accountToView = value || null;
      }
    }
  },

  mounted() {
    const { accounts } = this.$store.state;

    setTimeout(() => {
      this.subscriptions = accounts
    });
  }
}
</script>

<style lang="scss">
.account-dh-subscriton {

  .content-title {
    padding: 20px;
  }

  .account-dh-subscription-controls {
    padding: 0 20px 20px;
    display: flex;
    justify-content: flex-end;
  }

  .list-item {
    &.header {
      font-weight: bold;
      display: flex;
      color: #2D2C2C;
    }

    &:not(.header) {
      .account-row {
        display: flex;
        align-items: center;
        color: #828282;
        font-size: 14px;

        .account-avatar {
          margin-right: 10px;
          height: 35px;
          width: 35px
        }

        .account-login {
          color: #ABABAB;
          font-size: 12px;
        }
      }
    }

    .account-row {
      width: 40%;
      padding-left: 20px;
    }

    .subscriprion-row {
      width: 20%;
      text-align: center
    }

    .followers-row {
      width: 20%;
      text-align: center
    }

    .renewalat-row {
      width: 20%;
    }

  }

  button {
    background: #6A12CB;
    border-radius: 100px;
    line-height: 16px;
    font-size: 16px;
    padding: 8px 25px;
  }
}

.subscription-type {
  display: inline-block;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  background-color: #A4A4A4;
  border-radius: 5px;
  padding: 5px 10px;
}

.subscription-dialog{
  .el-dialog {
    border-radius: 10px;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }

  .account-dh-info {
    width: 100%;
    border-right: none;
    margin-right: 0;
    min-height: 473px;
    padding: 43px 20px 20px;

    .account-dh-name {
      margin-bottom: 0;
    }

    .account-dh-login {
      padding-bottom: 15px;
      border-bottom: 1px solid #EEEEEE;
      width: 100%;
      text-align: center;
    }

    button {
      padding: 2px 26px;
      width: 100%;

      & + button {
        margin-top: 8px;
      }
    }
  }

  .account-plan {
    text-align: center;
    margin-top: 11px;
    font-weight: bold;
    font-size: 15px;

    .subscription-type {
      margin: 10px 0;
    }
  }
}
</style>
