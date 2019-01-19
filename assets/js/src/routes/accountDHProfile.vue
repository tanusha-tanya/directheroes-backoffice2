<template>
<div class="account-dh-profile">
  <div class="account-dh-info">
    <div class="account-dh-photo" :style="{'background-image': `url(${ igAvatar })`}"></div>
    <div class="account-dh-name">
      {{dhAccount.firstName}} {{dhAccount.lastName}}
    </div>
    <div class="account-dh-joined">
      Joined: <strong>{{joinedAt}}</strong>
    </div>
    <button @click="isPasswordChange = true">Change password</button>
  </div>
  <div class="account-dh-details">
    <div class="container-title">Basic information</div>
    <div class="account-dh-fields">
        <div class="account-dh-field">
          First Name <span>{{ dhAccount.firstName }}</span>
        </div>
         <div class="account-dh-field">
          Last Name <span>{{ dhAccount.lastName }}</span>
        </div>
    </div>
  </div>
  <el-dialog
    :visible.sync="isPasswordChange"
    title="Change password"
    width="321px"
    append-to-body
    class="password-dialog"
    :show-close="false"
    >
    <label>
      Current Password
      <input v-model="currentPassword"/>
    </label>
    <label>
      New Password
      <input v-model="newPassword" />
    </label>
    <label>
      Repeat Password
      <input v-model="reNewPassword"/>
    </label>
    <template slot="footer">
      <button >Save</button>
      <button class="cancel" @click="isPasswordChange = null">Close</button>
    </template>
  </el-dialog>
</div>
</template>
<script>
import igAvatar from '../assets/ig-avatar.jpg'
import moment from 'moment'

export default {
  data() {
    return {
      igAvatar,
      isPasswordChange: false,
      currentPassword: '',
      newPassword: '',
      reNewPassword: ''
    }
  },
  computed: {
    dhAccount() {
      return this.$store.state.dhAccount
    },

    joinedAt() {
      return moment(this.dhAccount.joinedAt * 1000).format('MMM Do YYYY')
    }
  },
}
</script>
<style lang="scss">
.account-dh-profile {
  display: flex;
  height: calc(100% - 40px);

  .account-dh-info {
    width: 230px;
    border-right: 1px solid #EEEEEE;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;

    button {
      border-radius: 30px;
      background-color: transparent;
      font-weight: normal;
      color: #828282;
      border: 1px solid #DBDBDB;
    }
  }

  .account-dh-photo {
    width: 98px;
    height: 98px;
    border-radius: 50px;
    background-position: center;
    background-size: contain;
    margin-bottom: 10px;
  }

  .account-dh-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .account-dh-joined {
    font-size: 10px;
    flex-grow: 1;
  }

  .account-dh-details {
    padding: 20px;
    width: 100%;
  }

  .container-title {
    font-weight: bold;
    font-size: 15px;
  }

  .account-dh-fields {
    font-size: 13px;
    color: #828282;

  }

  .account-dh-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px;

    span {
      border-radius: 30px;
      border: 1px solid #DBDBDB;
      flex-grow: 1;
      max-width: 75%;
      padding: 5px 15px;
    }
  }
}

.password-dialog {
  .el-dialog__header {
    text-align: center;
    font-weight: bold;
  }

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;

    input {
      width: 50%;
    }
  }
}
</style>
