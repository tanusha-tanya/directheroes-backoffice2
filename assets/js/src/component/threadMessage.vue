<template>
  <div :class="{'thread-list-item': true,  'account-message': isMe}">
    <div class="date" v-if="isShowDate">
      {{date(message.sentAt)}}
    </div>
    <div class="body">
      <div class="avatar" v-if="!isMe" :style="{'background-image': `${ contactProfile.profilePicUrl ? 'url(' + contactProfile.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
      <div class="wrapper" :title="message.sentAt && date(message.sentAt)">
        <div class="type" :title="message.typeExtended" v-if="message.type">
          {{ message.type }}
          <router-link
            class="bot-campaign"
            :to="{ name: 'accountCampaign', params: { campaignId: message.botCampaign.id } }"
            v-if="message.botCampaign"
            >
            {{message.botCampaign.name}}
          </router-link>
        </div>
        <div class="text" v-html="(message.text || '').replace(/\n/ig, '<br/>')"></div>
        <a class="post" v-if="message.postUrl" :href="message.postUrl" target="_blank">
          <div class="picture" :style="{'background-image': `url(${ message.previewUrl }), url(${ image })`}"></div>
        </a>
      </div>

      <div :class="{indicator: true, sent: message.isSeen}" v-if="isMe" :title="!message.sentAt && message.toBeSentAt && `Sending at ${ date(message.toBeSentAt)}`"
        >
        <font-awesome-icon :icon="['fas', 'check-circle']" v-if="message.sentAt"/>
        <font-awesome-icon :icon="['far', 'clock']" v-else-if="message.toBeSentAt"/>
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '../assets/ig-avatar.jpg'
import moment from 'moment'

export default {
  data() {
    return {
      defaultAvatar
    }
  },

  props:['message', 'prevMessage', 'contactProfile'],

  computed: {
    isMe() {
      const { message, contactProfile } = this;

      console.log(contactProfile, message);

      return contactProfile.username !== message.senderUsername
    },

    isShowDate() {
      const { message, prevMessage, isMe } = this;

      if (!message.sentAt) return;

      if (!prevMessage || !prevMessage.sentAt) return true;

      return prevMessage.senderUsername !== message.senderUsername || moment(message.sentAt).diff(prevMessage.sentAt, 'minutes') > 15;
    },

  },

  methods: {
    date(date) {
      return (new Date(date * 1000)).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})
    }
  }
}
</script>

<style lang="scss">
.thread-list-item {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .date {
    align-self: center;
    color: #A7A7A7;
    margin: 10px 0 15px;
  }

  .type {
    font-size: 10px;
    color: #a8a8a8;
    margin-top: -10px;
    display: flex;
    justify-content: space-between;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  .avatar {
    width: 32px;
    height: 32px;
    margin: 0 10px 5px 0;
    align-self: flex-end;
    flex-shrink: 0;
  }

  .body {
    display: flex;
    align-self: flex-start;
    max-width: 70%;
    position: relative;
  }

  .picture {
    width: 100%;
    padding-bottom: 80%;
    background-color: #fff;
    background-size: contain, 30%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 10px;
    border: 1px solid #DEDEDE;

    &:hover {
      background-color:#cfcfcf;
    }
  }

  .indicator {
    position: absolute;
    bottom: 3px;
    z-index: 1;
    right: 20px;
    color: #a8a8a8;

    &.sent {
      color: #742BF9;
    }
  }

  .post {
    width: 100%;
    min-width: 170px;
    display: block;
  }

  .text {
    line-height: 22px;
    font-size: 16px;
    word-break: break-word;
  }

  .wrapper {
    padding: 15px;
    border: 1px solid #DEDEDE;
    border-radius: 25px;
    margin-bottom: 10px;
  }

  .bot-campaign {
    color: #2c3e50;
    margin-left: 10px;
  }

  &.account-message {
    .body {
      align-self: flex-end;
    }

    .wrapper {
      background-color: #EFEFEF;
      border-color: #EFEFEF;
    }
  }
}

</style>
