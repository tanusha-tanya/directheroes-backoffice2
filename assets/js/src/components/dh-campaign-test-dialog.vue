<template>
  <el-dialog
    :visible.sync="isShow"
    title="Test Broadcast"
    width="554px"
    append-to-body
    class="dh-campaign-test-dialog"
    >
    <div class="dh-campaign-test-body" v-if="!sent">
      <el-select
        v-model="selectedSubscriber"
        remote
        filterable
        popper-class="dh-subscribers-dropdown"
        placeholder="Please enter a subscriber name"
        :remote-method="getSubscribers"
        :loading="searching">
        <el-option
          v-for="subscriber in subscribers"
          :key="subscriber.id"
          :label="subscriber.username"
          :value="subscriber">
          <div class="dh-subscriber-item">
            <div class="dh-subscriber-userpic" :style="{'background-image': `url(${ subscriber.contactProfile.profilePicUrl })`}"></div>
            <div class="dh-subscriber-info">
              <div class="dh-subscriber-name">{{subscriber.contactProfile.fullName}}</div>
              <div class="dh-subscriber-login">@{{subscriber.contactProfile.username}}</div>
            </div>
          </div>
        </el-option>
      </el-select>
      <div :class="{'dh-select-account-founded': true, 'dh-select-account-claiming': sending}" v-if="selectedSubscriber" @click="sendMessage">
        <div class="dh-select-account-userpic" :style="{ 'background-image': `url(${ selectedSubscriber.contactProfile.profilePicUrl })` }">
        </div>
        <div class="dh-select-account-info">
          <div class="dh-select-account-names">
            <strong>{{selectedSubscriber.contactProfile.fullName}}</strong> @{{selectedSubscriber.contactProfile.username}}
          </div>
          <div class="dh-select-account-text">
            Click here, to send broadcast message to this account.
          </div>
        </div>
      </div>
    </div>
    <div class="dh-campaign-test-body" v-else>
      <div class="dh-wizzard-success" >
        Message sent
      </div>
    </div>
    <template slot="footer">
      <span></span>
      <button class="dh-button dh-reset-button" :disabled="sending" @click="isShow = false">Close</button>
    </template>
  </el-dialog>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      sending: false,
      subscribers: [],
      searching: false,
      selectedSubscriber: null,
      source: null,
      sent: false
    }
  },

  props: ['value', 'campaignId'],

  computed: {
    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    },

    accountId() {
      return this.$route.params.accountId
    },

  },

  methods: {
    getSubscribers(keyword) {
      const { source, accountId } = this;
      const CancelToken = axios.CancelToken;

      this.searching = true;

      if (source) {
        source.cancel('Lalala')
      }

      this.source = CancelToken.source();

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ accountId }/audience`,
        method: 'post',
        data: {
          usernameQuery: keyword,
          subscribed: 'all',
          paging: {
            page: 1,
            totalPageCount: 1
          }
        },
        cancelToken: this.source.token
      })
      .then(({ data }) => {
        this.searching = false;

        this.subscribers = data.response.body.threadList;
      }).catch(()=> {});
    },

    sendMessage() {
      const { campaignId, accountId, selectedSubscriber } = this;
      this.sending = true;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/testBroadcast/${ campaignId }`,
        params: {
          accountId,
          threadId: selectedSubscriber.id
        }
      }).then(({ data }) => {
        this.sending = false;
        this.sent = true;
      })
    }
  }
}
</script>

<style lang="scss">
.dh-subscriber-item {
  display: flex;
  align-items: center;
  height: 44px;

  .dh-subscriber-userpic {
    width: 30px;
    height: 30px;
    background-color: rgba($borderColor, .5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
    margin-right: 16px;
  }

  .dh-subscriber-info {
    line-height: normal;
    color: #252631;
    margin-top: 2px;
  }

  .dh-subscriber-login {
    color: #98A9BC;
    font-size: 12px;
  }
}

.dh-campaign-test-body {
  min-height: 150px;

  .dh-wizzard-error, .dh-wizzard-success {
    height: 80px;
    width: 100%;
    background-color: #FE4D97;
    border-radius: 4px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 16px;
  }

  .dh-wizzard-success {
    background-color: $successColor;
  }
}

.dh-subscribers-dropdown {
  .el-select-dropdown__item {
    height: 44px;
  }
}

.dh-campaign-test-dialog {
  .el-select {
    width: 100%;

    .el-input {
      .el-input__inner {
        background-color: $sectionBG;
        border: 1px solid $borderColor;
        border-radius: 4px;
        padding: 14px 19px 16px 17px;
        line-height: 17px;
        font-weight: 500;
        color: $inputTextColor;
        outline: none;
      }

      &.is-focus {
        .el-input__inner {
          border-color: #9E4CF9;
        }
      }
    }

    .el-select-dropdown__item {
      height: 44px;
    }
  }

}
</style>