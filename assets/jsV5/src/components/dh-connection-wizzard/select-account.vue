<template>
  <div class="dh-wizzard-step dh-select-account">
    <div class="dh-wizzard-step-body">
      <div class="dh-select-account-controls">
        <input class="dh-input" type="text" v-model="login" placeholder="Enter Instagram login"/>
        <button :class="{'dh-button': true, 'dh-loading': finding}" :disabled="!login || finding" @click="findAccount">Find</button>
      </div>
      <div class="dh-select-account-founded" v-if="foundAccount" @click="selectAccount()">
        <div class="dh-select-account-userpic" :style="{ 'background-image': `url(${ foundAccount.profilePicUrl })` }">
        </div>
        <div class="dh-select-account-info">
          <div class="dh-select-account-names">
            <strong>{{foundAccount.fullName}}</strong> @{{foundAccount.username}}
          </div>
          <div class="dh-select-account-follows">
            <strong>{{foundAccount.followerCount}}</strong> followers    <strong>{{foundAccount.followingCount}}</strong> following
          </div>
          <div class="dh-select-account-text">
            Click here, if this is the account you are looking to connect.
          </div>
        </div>
      </div>
      <div class="dh-wizzard-error" v-if="error">
        {{error}}
      </div>
    </div>
    <div class="el-dialog__footer">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      login: '',
      finding: false,
      foundAccount: null,
      error: null,
    }
  },

  methods: {
    findAccount() {
      const { login } = this;

      this.error = null;
      this.foundAccount = null;
      this.finding = true;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/username/check_availability`,
        params: {
          username: login
        }
      }).then(({ data }) => {
        const { request, response } = data;
        const { account } = response.body;
        this.finding = false;

        if (!request.success) {
          this.error = request.statusMessage;
          return;
        }

        this.foundAccount = account;
      }).catch(error => {
        const { statusMessage } = error.response.data.request;

        this.error = statusMessage;
        this.finding = false;
      })
    },

    selectAccount() {
      const { username } = this.foundAccount;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/claim_ownership`,
        params: {
          username,
          isClaimed: true
        }
      }).then(({ data }) => {
        const { account_info } = data.response.body;

        this.$emit('set-account', account_info);
      })
    }
  }
}
</script>

<style lang="scss">
.dh-select-account {
  .dh-select-account-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dh-input {
    flex-grow: 1;
  }

  .dh-button {
    min-width: 100px;
    margin-left: 20px;
  }

  .dh-select-account-founded {
    height: 80px;
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    margin-top: 20px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    color: #98A9BC;
    cursor:pointer;
    box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);

    strong {
      color: #303133;
    }
  }

  .dh-select-account-info {
    width: 100%;
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

  }

  .dh-select-account-userpic {
    width: 40px;
    height: 40px;
    background-color: rgba($borderColor, .5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
  }

  .dh-select-account-text {
    width: 100%;
    text-align: center;
    margin-top: 4px;
  }
}
</style>