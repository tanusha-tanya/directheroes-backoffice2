<template>
  <header>
    <div class="navicon"><img :src="navicon" v-if="false"/></div>
    <div class="logo">
      <img :src="logo"/>
    </div>
    <div class="dh-account">
      <div class="notifications" v-if="false">
        <img :src="bell"/>
      </div>
      <el-popover placement="bottom" trigger="hover" v-if="dhAccount">
        <div class="dh-account-popover">
          <a href="mailto:admin@directheroes.com">Help</a>
          <a href="/settings">Settings</a>
          <a href="/logout">Log out</a>
        </div>
        <div class="dh-account-details" slot="reference">
          <img :src="avatar"/>
        </div>
      </el-popover>
    </div>
    
    
    <!-- <account-dialog>
    </account-dialog> -->
  </header>
</template>

<script>
import navicon from '../assets/svg/navicon-w.svg'
import logo from '../assets/svg/logo-white.svg'
import avatar from '../assets/svg/avatar.svg'
import bell from '../assets/svg/bell.svg'

export default {
  data() {
    return {
      navicon,
      logo,
      avatar,
      bell
    }
  },

  computed: {
    dhAccount() {
      return this.$store.state.dhAccount
    },
  }
}
</script>

<style lang="scss">
.dh-account-popover {
  display: flex;
  flex-direction: column;

  a {
    margin-top: 5px;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 8px;
    opacity: .7;
    color: #3C3C3C;
    cursor: pointer;
    text-decoration: none;
    transition: .3s opacity;

    &:hover {
      opacity: 1;
    }
  }
}
  header {
    display: flex;
    background: linear-gradient(270.02deg, #742BF9 12.02%, #6A12CB 43.43%, #6A12CB 63.64%, #6A12CB 100%);
    color: #fff;
    align-items: center;
    padding: 8px 20px 9px 8px;
    justify-content: space-between;

    .logo {
      height: 33px;
    }

    .navicon {
      margin-right: 5px;

      img {
        height: 23px;
        opacity: .76;
      }
    }

    .dh-account {
      display: flex;
      align-items: center;

      .notifications {
        margin-right: 18px;
      }

      .dh-account-details {
        display: flex;
        align-items: center;

        &:after {
          content: '';
          border: 6px solid;
          border-color: #fff transparent transparent;
          border-bottom: 0px;
          margin-left: 3px;
        }
      }
    }
  }

</style>