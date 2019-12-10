<template>
  <div class="dh-view dh-settings-view">
    <dh-header title="Profile Settings"></dh-header>
    <div class="dh-view-content">
      <div class="dh-profile-settings">
        <div class="dh-profile-settings-list">
          <router-link :to="{ name: 'settings'}" class="dh-profile-settings-item">
            <profile />
            <div class="dh-profile-settings-info">
              <div class="dh-profile-settings-title">
                General information
              </div>
              Profile pic, name & language
            </div>
          </router-link>
          <router-link :to="{ name: 'security'}" class="dh-profile-settings-item">
            <security />
            <div class="dh-profile-settings-info">
              <div class="dh-profile-settings-title">
                Security
              </div>
              Password & security questions
            </div>
          </router-link>
          <router-link :to="{ name: 'billing'}" class="dh-profile-settings-item">
            <billing />
            <div class="dh-profile-settings-info">
              <div class="dh-profile-settings-title">
                Billing
              </div>
              Setup payment methods
            </div>
          </router-link>
          <router-link :to="{ name: 'managers'}" class="dh-profile-settings-item">
            <billing />
            <div class="dh-profile-settings-info">
              <div class="dh-profile-settings-title">
                Managers
              </div>
              Entrusted dh-accounts
            </div>
          </router-link>
        </div>
        <router-view></router-view>
      </div>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import security from '../assets/security.svg'
import billing from '../assets/billing.svg'
import profile from '../assets/profile.svg'
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'

export default {
  components: {
    dhHeader,
    dhFooter,
    profile,
    billing,
    security
  },
};
</script>

<style lang="scss">
.dh-settings-view {
  .dh-view-content {
    display: flex;
  }

  .dh-profile-settings {
    width: 100%;
    background-color: $sectionBG;
    border-radius: 4px;
    display: flex;
    flex-grow: 1;
    max-height: calc(100vh - 173px);
  }

  .dh-profile-settings-list {
    width: 293px;
    flex-shrink: 0;
    border-right: 1px solid $secondBorderColor;
  }

  .dh-profile-settings-item {
    display: flex;
    padding: 16px 24px 14px;
    color: $textColor;
    text-decoration: none;
    border-bottom: 1px solid $secondBorderColor;

    &.router-link-exact-active {
      background-color: $secondBorderColor;
      border-right: 2px solid $elementActiveColor;
      color: $elementActiveColor;

      .dh-profile-settings-title {
        color: $elementActiveColor;
      }

      .dh-profile-settings-info {
        color: $textColor;
      }
    }

    svg {
      width: 14px;
      max-height: 16px;
      margin-right: 16px;
    }
  }

  .dh-profile-settings-title {
    color: $mainTextColor;
    font-size: 16px;
    line-height: 19px;
  }
}
</style>