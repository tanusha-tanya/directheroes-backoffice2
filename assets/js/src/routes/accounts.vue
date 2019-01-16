<template>
  <div class="accounts-content">
    <div class="account-list">
      <div class="account-card add-account" @click="isAddAccount = true">
        <div class="account-photo"></div>
        <div class="account-login">Add new account</div>
        <div class="account-follow-info">
          <div>0<br/>following</div>
          <div>0<br/>followers </div>
        </div>
      </div>
      <router-link  class="account-card" 
        v-for="account in accounts" 
        :key="account.id"
        :to="{ name: 'accountHome', params: { accountId: account.id } }"
        >
        <div class="account-photo" :style="{'background-image': `url(${ account.profilePicUrl })`}"></div>
        <div class="account-login"> @{{ account.login }}</div>
        <div class="account-follow-info">
          <div>{{ account.followingCount || 0 }}<br/>following</div>
          <div>{{ account.followerCount || 0 }}<br/>followers </div>
        </div>
      </router-link >
    </div>
    <add-account-dialog :is-add-account="isAddAccount" @close-dialog="isAddAccount = false"></add-account-dialog>
  </div>
</template>
<script>
import addAccountDialog from '../component/addAccountDialog.vue'

export default {
  beforeRouteEnter(to, from, next) {
    const { body } = document;

    body.classList.add('no-overlay')
    next();
  },

  beforeRouteLeave(to, from, next) {
    const { body } = document;

    body.classList.remove('no-overlay')
    next();
  },

  data() {
    return {
      isAddAccount: false
    }
  },

  components: {
    addAccountDialog
  },

  computed: {
    accounts() {
      return this.$store.state.accounts
    },
  }
}
</script>
<style lang="scss">
.accounts-content {
  padding: 30px 50px;

  .account-list {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }

  .add-account {
    .account-photo {
      border: 1px solid #DBDBDB;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      
      &:after, &:before {
        content: '';
        border: 2px solid #DBDBDB;
        width: 32px;
        position: absolute;
      }

      &:after {
        transform: rotate(90deg)
      }
    }

    .account-login {
      border: 1px solid #DBDBDB;
      color: #DBDBDB;
      font-weight: normal;
      padding: 4px 10px;
      border-radius: 2px;
    }

    .account-follow-info {
      color: #DBDBDB;
    }
  }

  .account-card {
    margin: 10px;
    background: #FFF;
    border: 1px solid #DBDBDB;
    box-shadow: 0px 2px 4px rgba(215, 215, 215, 0.5);
    border-radius: 10px;
    
    &:hover {
      border: 2px solid rgba(106, 18, 203, 0.7);
    }
  }
}

.no-overlay .v-modal {
  opacity: 0;
}
</style>