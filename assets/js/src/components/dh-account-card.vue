<template>
  <div
    :class="{
      'dh-account-card': true,
      'dh-account-fail-status': !account.isLoggedIn,
      'dh-account-success-status': account.isLoggedIn,
      'dh-account-frozen': isFrozen,
      'dh-account-updating': updating,
    }">
    <el-popover v-model="showActionsPopup" placement="bottom" trigger="click">
      <div class="dh-options">
        <div class="dh-option" @click="accountAction('toggle-freez')" v-if="canBeFrozen">
          <snowflake /> {{isFrozen ? 'Unfreez' : 'Freez'}}
        </div>
        <div class="dh-option" @click="accountAction('delete-account')">
          <trash /> Delete
        </div>
      </div>
      <div class="dh-account-options-icon" slot="reference" @click="blockEvent">
        <ellipsis />
      </div>
    </el-popover>
    <div class="dh-account-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
      <div class="dh-account-status">
      </div>
    </div>
    <div class="dh-account-full-name">
      {{ account.fullName }}
    </div>
    <div class="dh-account-ig-name">
      @{{ account.login }}
    </div>
    <div class="dh-account-follow-info">
      <span><strong>{{account.followerCount || 0}}</strong> followers</span>
      <span><strong>{{account.followingCount || 0}}</strong> following</span>
    </div>
    <div class="dh-account-frozen-info" v-if="isFrozen">
      <span>
        <snowflake />Account is frozen<snowflake />
      </span>
    </div>
    <div class="dh-account-connect-error" v-else-if="!account.isLoggedIn">
      <span>
        Click Here To Reconnect<br/>
        <warning />Instagram Account<warning />
      </span>
    </div>
    <div class="dh-account-owner-info" v-if="account.owner">
      <span>Owned by</span>  <strong>{{account.owner.firstName}} {{account.owner.lastName}}</strong>
    </div>
  </div>
</template>

<script>
import warning from '../assets/warning.svg'
import ellipsis from '../assets/ellipsis.svg'
import trash from '../assets/trash.svg'
import snowflake from '../assets/snowflake.svg'

export default {
  data() {
    return {
      showActionsPopup: false,
      updating: false,
    }
  },

  props: ['account'],

  components: {
    warning,
    ellipsis,
    snowflake,
    trash,
  },

  computed: {
    subscription() {
      const { account } = this;
      const { subscriptions } = this.dhAccount;

      return subscriptions.find(subscription => subscription.id === account.subscriptionId);
    },

    isFrozen() {
      const { subscription } = this;

      return subscription && subscription.planCode === 'account_freeze'
    },

    canBeFrozen() {
      const { subscription } = this;

      return subscription && subscription.maxAccounts == 1;
    }
  },

  methods: {
    accountAction(actionName) {
      const { account, isFrozen } = this;

      this.$emit(actionName, account, isFrozen);
      this.showActionsPopup = false;
    }
  }
}
</script>

<style lang="scss">
.dh-account-card {
  position: relative;
  margin: 14px;
  width: 262px;
  height: 324px;
  border-radius: 4px;
  background-color: $sectionBG;
  padding: 28px 32px;
  display: flex;
  color:inherit;
  text-decoration: none;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: box-shadow .3s;

  &:hover {
    box-shadow: 0 0 0 2px $elementActiveColor;

    .dh-account-full-name {
      color: $elementActiveColor;
    }
  }

  &.dh-account-fail-status {
    border: 1px solid $failColor;
    box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);

    .dh-account-userpic {
      border-color: $failColor;
    }

    .dh-account-status {
      width: 14px;
      height: 14px;
      border: 4px solid $failColor;
      bottom: 9px;
      background-color: $sectionBG;
    }
  }

  &.dh-account-success-status {
    .dh-account-userpic {
      border-color: $successColor;
    }

    .dh-account-status {
      width: 14px;
      height: 14px;
      border: 4px solid $successColor;
      bottom: 9px;
      background-color: $sectionBG;
    }
  }

  &.dh-account-frozen {
    border: 1px solid #2CE5F6;
    background-color: rgba($sectionBG, .1);

    .dh-account-userpic {
      border-color: #2CE5F6;
    }

    .dh-account-status {
      border-color: #2CE5F6;
    }

  }

  &.dh-account-updating {
    position: relative;
    pointer-events: none;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(#FFF, .8);
      z-index: 3;
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: calc(50% - 23px);
      left: calc(50% - 23px);
      width: 40px;
      height: 40px;
      border-radius: 40px;
      border: 5px solid $elementActiveColor;
      border-bottom-color: transparent;
      animation: rotation .8s infinite linear;
      z-index: 4;
    }
  }

  .dh-account-options-icon {
    position: absolute;
    right:14px;
    top: 9px;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }

  .dh-account-userpic {
    width: 112px;
    height: 112px;
  }

  .dh-account-status {
    color: $textColor;
    position: absolute;
    bottom: 0;
    right: 8px;
    border-radius: 50%;
    border: 2px solid #fff;
    background-color: #fff;
  }

  .dh-account-full-name {
    font-size: 20px;
    line-height: 24px;
    margin-top: 18px;
  }

  .dh-account-ig-name {
    font-size: 14px;
    line-height: 21px;
    color: $textColor;
    margin-top: 3px;
  }

  .dh-account-follow-info {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 16px;
    line-height: 18px;
    text-align: center;
  }

  .dh-account-add-info {
    color: $textColor;
    line-height: 21px;
    text-align: center;
    margin-top: 37px;
  }

  .dh-account-connect-error {
    color: $failColor;
    white-space: nowrap;
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    text-align: center;
  }

  .dh-account-frozen-info {
    color: #2CE5F6;

    span{
      display: flex;
      align-items: center;
    }

    svg {
      width: 20px;
      margin: 15px 5px;
    }
  }

  .dh-account-owner-info {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    color: $textColor;
    margin-bottom: -20px;

    strong {
      margin-left: 5px;
    }

    span, strong {
      white-space: nowrap;
    }
  }
}
</style>