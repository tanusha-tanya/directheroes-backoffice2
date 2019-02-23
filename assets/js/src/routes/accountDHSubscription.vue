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
          <div class="list-item" v-for="thread in threads" :key="thread.id">
            <div class="user-row">
              <div class="user-avatar" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl })`}"></div>
              {{thread.contactProfile.username}}
            </div>
            <div class="subscribed-row">{{ thread.subscribedAt ? subscriberAt(thread.subscribedAt) : ''}}</div>
            <div class="lastmessage-row">{{subscriberAt(thread.lastMessageAt)}}</div>
            <div class="campaigns-row">
              <router-link
                :to="{ name: 'accountCampaign', params: { campaignId: campaign.id } }"
                v-for="campaign in thread.campaignList"
                :key="campaign.id"
                >{{campaign.name}}</router-link>
            </div>
            <div class="chat-row">
              <router-link :to="{ name: 'accountThreadMessages', params: { threadId: thread.id, subscribed: subscribedText } }">Live chat</router-link>
              <router-link :to="{ name: 'accountThreadInfo', params: { subscriberId: thread.id } }" class="account-button" ><img :src="avatar"/></router-link>
            </div>
          </div>
        </template>
        <div class="no-result" v-else>
          No subscription found
        </div>
      </template>
      <div class="loading-content" v-else>
        <div class="pre-loader"></div>
      </div>
  </div>
</template>
<script>
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
        return this.accountToView
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

    .subscription-type {
      display: inline-block;
      font-weight: bold;
      text-transform: uppercase;
      color: #fff;
      background-color: #A4A4A4;
      border-radius: 5px;
      padding: 5px 10px;
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
</style>
