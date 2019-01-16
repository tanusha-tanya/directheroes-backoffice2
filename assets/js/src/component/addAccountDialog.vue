<template>
  <el-dialog
    :visible.sync="addAcountState"
    class="add-account-dialog"
    title="Add new Instagram Account"
    width="321px"
    append-to-body
    :show-close="false"
    >
    <div class="step">
      <div class="step-info">
        <div class="step-number">
          1
        </div>
        <div class="step-description">
          Download and run our proxy tool to connect your account.
        </div>
      </div>
      <div class="download-buttons">
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=win`">
          <img src="../assets/svg/windows.svg"/>
          Download for Windows
        </a>
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=mac`">
          <img src="../assets/svg/apple.svg"/>
          Download for Mac
        </a>
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=mac`">
          <img src="../assets/svg/ubuntu.svg"/>
          Download for Linux
        </a>
      </div>
    </div>
    <div class="step">
      <div class="step-info">
        <div class="step-number">
          2
        </div>
        <div class="step-description">
          Connect to server by proxy tool and wait green light.
        </div>
      </div>
      <div class="status-block" v-if="proxyStatus">
        <div class="status-indicator success"></div> Proxy tool is running
      </div>
      <div class="status-block" v-else>
        <div class="status-indicator"></div> Proxy tool not connected
      </div>
    </div>
    <div class="step">
      <div class="step-info">
        <div class="step-number">
          3
        </div>
        <div class="step-description">
          Enter Instagram credentials.
        </div>
      </div>
      <input placeholder="Instagram Username" v-model="account.login">
      <input placeholder="Instagram Password" v-model="account.password">
      <button :class="{ loading }" :disabled="loading || !account.login || !account.password">Connect Account</button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      checkingInterval: null,
      proxyStatus: false,
      account: {
        login: '',
        password: '',
      },
      error: null,
      loading: false,
    }
  },

  props: ['isAddAccount'],

  computed: {
    addAcountState: {
      get() {
        return this.isAddAccount
      },
      set(value) {
        this.$emit('close-dialog', value)
      }
    },

    dh() {
      return dh;
    }
  },

  methods: {
    checkConnection() {
      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/proxy-status`
      }).then(({ data }) => {
        this.proxyStatus = data.response.body.isProxyRunning
      }) 
    },

    addAccount() {
      const { $store } = this;

      this.loading = true;
      this.error = null;

      $store.dispatch('addAccount', this.account)
        .then(({ data }) => {
          this.loading = false;
        }).catch(error => {
          this.error = error.response.data.error;            
          this.loading = false;
        })
    }
  },

  watch: {
    isAddAccount(value) {
      if (value) {
        this.checkConnection();
        this.checkingInterval = setInterval(this.checkConnection.bind(this), 2000)
      } else {
        clearInterval(this.checkingInterval)
      }
    }
  }
}
</script>
<style lang="scss">
.add-account-dialog {
  .el-dialog {
    margin: 50px 0 0 auto !important;
    height: calc(100% - 50px);
    border-radius: 0;
    padding: 31px 39px;
    
    // &.dialog-fade-enter-active {
    //   animation: none;
    // }

    // &.dialog-fade-enter-active {
    //   animation: none;
    // }

    .el-dialog__header, .el-dialog__body {
      padding: 0;
    }

    .el-dialog__title {
      font-size: 20px;
      color: #6A12CB;
    }

    .el-dialog__header {
      margin-bottom: 24px;
    }

    .step {
      color: #B6B6B6;
      font-size: 15px;

      &:not(:last-child) {
        margin-bottom: 37px;
      }
    }

    .step-info {
      display: flex;
    }

    .step-number {
      height: 27px;
      width: 27px;
      flex-shrink: 0;
      margin-right: 8px;
      border: 1px solid currentColor;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .step-description {
      margin-top: 6px;
    }

    .download-buttons {
      margin-top: 15px;

      a {
        display: flex;
        align-items: center;
        text-decoration: none;
        background-color: #F2F2F2;
        border-radius: 2px;
        padding: 7px 10px;
        color: inherit;
        margin-bottom: 10px;
      }

      img {
        margin-right: 9px;
        max-height: 16px;
      }
    }

    .status-block {
      margin-top: 15px;
      display: flex;
      align-items: center;
    }

    .status-indicator {
      height: 27px;
      width: 27px;
      background-color: #FF4D4D;
      border-radius: 20px;
      margin-right: 9px;

      &.success {
        background-color: #44B0A9;
      }
    }

    input {
      margin-top: 10px;
      border-radius: 2px;
      width: 100%;

      &::placeholder {
        text-align: center;
        font-style: italic;
      }
    }

    button {
      margin-top: 10px;
      width: 100%;

      &:disabled {
        opacity: .6;
      }

      &:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    &.loading {
      color: transparent;
      position: relative;

      &:before {
        content: '';
        display: block;
        position: absolute;
        top: calc(50% - 10px);
        left: calc(50% - 10px);
        width: 15px;
        height: 15px;
        border-radius: 100%;
        border: 3px solid #FFF;
        border-bottom-color: transparent;
        animation: rotation  .8s infinite linear;
      }
    }
    }
  }
}
</style>
