<template>
  <div :class="{'thread-list-item': true,  'account-message': isMe, 'last-group-message': isLastGroupMessage , 'not-sended': !message.id }">
    <div class="body">
      <div class="avatar" :style="{'background-image': `url(${avatarUrl})`}" v-if="message.id"></div>
      <div class="avatar empty" v-else></div>
      <div :class="{
        wrapper: true,
        'bot-message': message.botCampaign,
        'live-message': isMe && !message.botCampaign,
        'queue-message': isMe && !message.sentAt && message.toBeSentAt
        }" :title="message.sentAt && date(message.sentAt)">
        <div class="type" :title="message.typeExtended" v-if="false && message.type">
          {{ message.type }}
          <router-link
            class="bot-campaign"
            :to="{ name: 'accountCampaign', params: { campaignId: message.botCampaign.id } }"
            v-if="false && message.botCampaign"
            >
            {{message.botCampaign.name}}
          </router-link>
        </div>
        <div class="text" v-html="(message.text || '').replace(/\n/ig, '<br/>')"></div>
        <a class="post" v-if="message.previewUrl" :href="message.previewUrl" target="_blank">
          <div class="picture" :style="{'background-image': `url(${ message.previewUrl })`}"></div>
        </a>
      </div>
      <div :class="{indicator: true, sent: message.isSeen}" v-if="isMe" :title="!message.sentAt && message.toBeSentAt && `Sending at ${ date(message.toBeSentAt)}`">
      </div>
    </div>
    <div class="date" v-if="isShowDate">
      {{date(message.sentAt)}}
    </div>
    <div class="error" v-if="message.error" @click="$emit('retry-send', message)">
      Error send, Click here to retry.
    </div>
  </div>
</template>

<script>
import defaultAvatar from '../assets/ig-avatar.jpg'
import moment from 'moment'
// import image from '../assets/svg/image-placeholder.svg'

export default {
  // data() {
  //   return {
  //     image,
  //   }
  // },

  props:['message', 'prevMessage', 'nextMessage', 'contactProfile', 'owner'],

  computed: {
    isMe() {
      const { message, contactProfile } = this;

      return contactProfile.username !== message.senderUsername
    },

    avatarUrl() {
      const { isMe, contactProfile, owner } = this;

      return (isMe ? owner.profilePicUrl : contactProfile.profilePicUrl) || defaultAvatar;
    },

    isShowDate() {
      const { message, nextMessage, isMe, prevMessage } = this;

      if (!message.sentAt) return;

      if (!nextMessage) return true;

      return nextMessage.senderUsername !== message.senderUsername || ( moment(nextMessage.sentAt * 1000).diff(message.sentAt * 1000, 'minutes') > 15);
    },

    isLastGroupMessage() {
      const { message, nextMessage } = this;

      return !nextMessage || !nextMessage.id || nextMessage.senderUsername !== message.senderUsername
    }
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
  margin-bottom: 3px;

  .date {
    align-self: center;
    font-size: 12px;
    line-height: 18px;
    color: #98A9BC;
    margin-bottom: 10px;
    text-align: left;
    width: 100%;
    padding: 0 44px;
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
    width: 24px;
    height: 24px;
    margin: 0 10px 5px;
    align-self: flex-end;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: rgba(232, 236, 239, 0.5);

    &:not(.empty) {
       opacity: 0;
    }
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
    background-color: #fff;
    border-radius: 50px;

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
    padding: 9px 19px 4px;
    border-radius: 18px;
    background-color: $secondBorderColor;
    // margin-right: 69px;
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
      background-color: $secondBorderColor;
      border-color: $secondBorderColor;

      &.bot-message {
        background-color: #742BF9 !important;
        color: #fff
      }

      &.live-message {
        background-color: #2674f5 !important;
        color: #fff
      }
    }

    .avatar {
      order: 1;
    }

    .date {
      text-align: right;
    }

    .error {
      text-align: right;
      cursor: pointer;
    }
  }

  &.last-group-message {
    .wrapper {
      border-bottom-left-radius: 0;
    }

     &.account-message {
       .wrapper {
          border-bottom-left-radius: 18px;
          border-bottom-right-radius: 0;
        }
     }

    .avatar {
      opacity: 1;
    }
  }
}

</style>
