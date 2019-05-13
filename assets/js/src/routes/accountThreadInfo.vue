<template>
<div class="subscriber-info w800" v-if="subscriber">
  <div class="container-area">
    <div class="subscriber-title">
      {{ subscriber.fullName }}
    </div>
    <div class="subscriber-content">
      <div class="subscriber-profile">
        <div  class="account-card">
          <div class="account-photo" :style="{'background-image': `url(${ subscriber.profilePicUrl })`}"></div>
          <div class="account-login"> @{{ subscriber.username }}</div>
          <div class="account-follow-info">
            <div>{{ subscriber.followingCount || 0 }}<br/>following</div>
            <div>{{ subscriber.followerCount || 0 }}<br/>followers </div>
          </div>
        </div>
        <div class="account-bio">
          {{ subscriber.bio }}
        </div>
        <a class="account-website" :href="subscriber.website" target="_blank">
          {{ subscriber.website }}
        </a>
      </div>
      <div class="subscriber-details">

      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      subscriber: null
    }
  },

  created() {
    const { subscriberId } = this.$route.params;

    axios({
      url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/subscriber/fetch-info?id=${ subscriberId }`,
    })
    axios({
      url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/subscriber/get?id=${ subscriberId }`,
    })
    .then(({ data }) => {
      const { subscriber } = data.response.body

      this.subscriber = subscriber;
    })
  }
}
</script>

<style lang="scss">
.subscriber-info {
  padding: 15px;
  color: #3C3C3C;

  .container-area {
    height: 100%;
  }

  .subscriber-title {
    padding: 12px 44px 9px;
    font-size: 15px;
    font-weight: bold;
    border-bottom: 1px solid #EEEEEE;
  }

  .subscriber-content {
    display: flex;
    height: calc(100% - 38px);
  }

  .subscriber-profile {
    height: 100%;
    border-right: 1px solid #EEEEEE;
    padding: 0 20px;
    flex-shrink: 0;
    max-width: 220px;
  }

  .subscriber-details {
    flex-grow: 1;
  }
}
</style>
