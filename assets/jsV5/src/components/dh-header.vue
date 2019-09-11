<template>
  <div class="dh-header">
    <div class="dh-menu-toggler">
      <menuToggler />
    </div>
    <div class="dh-header-title" v-if="title">
      {{title}}
    </div>
    <div class="dh-header-content">
      <slot></slot>
    </div>
    <div class="dh-header-notifications">
      <bell />
    </div>
    <div class="dh-header-settings">
      <gear />
    </div>
    <div class="dh-header-account">
      <el-popover placement="bottom" trigger="click" popper-class="dh-account-popover" v-if="dhAccount" :width="254" :offset="50">
        <div class="dh-account-popover-info">
          <div class="dh-account-popover-fullname">
            {{dhAccount.firstName}} {{dhAccount.lastName}}
          </div>
          <div class="dh-account-popover-email">
            {{dhAccount.username}}
          </div>
        </div>
        <div class="dh-account-popover-options">
          <router-link :to="{ name: 'settings'}" class="dh-account-popover-option"><profile /> Your profile</router-link>
          <router-link :to="{ name: 'settings'}" class="dh-account-popover-option"><gear /> Settings</router-link>
          <a href="/logout" class="dh-account-popover-option"><signout /> Sign out</a>
        </div>
        <div class="dh-header-account-icon" slot="reference">
          <profile />
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import menuToggler from '../assets/menu.svg'
import bell from '../assets/bell.svg'
import gear from '../assets/gear.svg'
import signout from '../assets/signout.svg'
import profile from '../assets/profile.svg'

export default {
  components: {
    menuToggler,
    bell,
    gear,
    signout,
    profile,
  },

  props: ['title']
}
</script>

<style lang="scss">
.dh-header {
  height: 64px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: $sectionBG;
  border-bottom: 1px solid $borderColor;
  padding: 0 28px;

  .dh-menu-toggler {
    color: $elementsColor;
    margin-right: 29px;
  }

  .dh-header-title {
    font-size: 20px;
    line-height: 24px;
  }

  .dh-header-content {
    flex-grow: 1;
  }

  .dh-header-notifications {
    color: $elementsColor;
    margin-right: 27px;
  }

  .dh-header-settings {
    color: $elementsColor;
    margin-right: 27px;
    width: 19px;
  }

  .dh-header-account-icon {
    width: 18px;
    height: 18px;
    color: $elementsColor;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

div.dh-account-popover.el-popper {
  margin-top: 17px;
  padding: 0;
  box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);
  border-radius: 4px;

  div.popper__arrow {
    border-width: 15px;
    top: -30px;
    border-bottom-color: #fff;

    &:after {
      border-bottom-color: $mainBGColor;
      top: -2px;
      border-width: 9px;
      margin-left: -9px;
    }
  }

  .dh-account-popover-info {
    background-color: $mainBGColor;
    padding: 28px 20px 18px;
  }

  .dh-account-popover-fullname {
    font-weight: 500;
  }

  .dh-account-popover-email {
    color: $textColor;
  }

  .dh-account-popover-options {
    padding: 7px;
  }

  .dh-account-popover-option {
    padding: 13px;
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: inherit;
    text-decoration: none;

    svg {
      width: 100%;
      max-width: 13px;
      flex-shrink: 0;
      color: $elementsColor;
      margin-right: 6px;
    }
  }
}
</style>