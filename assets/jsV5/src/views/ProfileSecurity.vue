<template>
  <div class="dh-settings-form dh-profile-security">
    <div class="dh-settings-title">
      Change password
    </div>
    <div class="dh-settings-form-row">
      <label class="dh-label">
        <span>Current Password</span>
        <input type="password" placeholder="Enter your password" class="dh-input" @input="clearNotifications" v-model="currentPassword">
      </label>
      <label class="dh-label">
        <span>New Password</span>
        <input type="password" placeholder="Enter new password" class="dh-input" @input="clearNotifications" v-model="newPassword">
      </label>
      <label class="dh-label">
        <span>Repeat Password</span>
        <input type="password" placeholder="Enter new password" class="dh-input" @input="clearNotifications" v-model="reNewPassword">
      </label>
    </div>
    <div class="dh-notification dh-notification-error" v-if="error">
      <warning /> {{error}}
    </div>
    <div class="dh-notification" v-else-if="notification">
      {{notification}}
    </div>
    <div class="dh-spacer"></div>
    <div class="dh-settings-form-footer">
      <button :class="{'dh-button': true, 'dh-loading': loading}" :disabled="!currentPassword || !newPassword || !reNewPassword" @click="changePassword">
        Update
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import warning from '../assets/warning.svg'

export default {
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      reNewPassword: '',
      error: null,
      notification: null,
      loading: false
    }
  },

  components: {
    warning,
  },

  methods: {
    changePassword() {
      const { currentPassword, newPassword, reNewPassword} = this;

      if (newPassword !== reNewPassword) {
        this.error = 'New password not equal repeat password';
        return;
      }

      this.notification = this.error = null;
      this.loading = true;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/dh-account/change-password`,
        method: 'post',
        data: {
          oldPassword: currentPassword,
          newPassword
        }
      }).then(({data}) => {
        this.notification = "Password successfully changed"
        this.isPasswordChange = false;
        this.loading = false;
      }).catch(({response}) => {
        this.error = response.data.request.statusMessage;
        this.loading = false;
      })
    },

    clearNotifications() {
      this.error = this.notification = null;
    }
  },
}
</script>

<style lang="scss">
.dh-profile-general {
  .dh-notification {
    margin-top: 10px;
  }
}
</style>