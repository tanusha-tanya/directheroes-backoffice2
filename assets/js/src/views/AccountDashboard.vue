<template>
  <div class="dh-view dh-dashboard-view">
    <dh-header title="Dashboard"></dh-header>
    <div class="dh-view-content">
      <div class="dh-dashboard-ig-account" v-if="account">
        <div class="dh-dashboard-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
        </div>
        <div class="dh-dashboard-ig-account-info">
          <div class="dh-dashboard-ig-account-main">
            <div class="dh-dashboard-ig-account-name">{{ account.login }}</div>
            <div class="dh-dashboard-ig-account-data">
              <span><strong>{{ account.postCount || 0 }}</strong> posts</span>
              <span><strong>{{ account.followerCount || 0 }}</strong> followers</span>
              <span><strong>{{ account.followingCount || 0 }}</strong> following</span>
            </div>
          </div>
          <div class="dh-dashboard-ig-account-bio" v-html="account.bio && account.bio.replace(/\n/g, '<br>')">
          </div>
        </div>
      </div>
      <div class="dh-dashboard-analytics">
        <div class="dh-dashboard-analytics-item">
          <div class="dh-analytics-item-info">
            {{lastFollowerCount.value.toLocaleString()}}
          </div>
          <div class="dh-analytics-item-graph">
            <vue-c3 :handler="followersGraph"></vue-c3>
          </div>
        </div>
        <div class="dh-dashboard-analytics-item">
          <div class="dh-analytics-item-info">
            {{lastLikeCount.value.toLocaleString()}}
          </div>
          <div class="dh-analytics-item-graph">
            <vue-c3 :handler="likeGraph"></vue-c3>
          </div>
        </div>
        <div class="dh-dashboard-analytics-item">
          <div class="dh-analytics-item-info">
            {{lastCommentCount.value.toLocaleString()}}
          </div>
          <div class="dh-analytics-item-graph">
            <vue-c3 :handler="commentGraph"></vue-c3>
          </div>
        </div>
      </div>
      <dh-campaigns title="Campaigns" :limit="5">
      </dh-campaigns>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhCampaigns from '../components/dh-campaigns'
import Vue from 'vue'
import axios from 'axios'
import VueC3 from 'vue-c3'

export default {
  data() {
    return {
      followersGraph: new Vue(),
      likeGraph: new Vue(),
      commentGraph: new Vue(),
      analyticInfo: {
        "followerCount": [
          {
            "time": "2019-11-21T00:00:00Z",
            "value": 11
          },
          {
            "time": "2019-11-22T00:00:00Z",
            "value": 11
          },
          {
            "time": "2019-11-23T00:00:00Z",
            "value": 11
          },
          {
            "time": "2019-11-24T00:00:00Z",
            "value": 11
          },
          {
            "time": "2019-11-25T00:00:00Z",
            "value": 11
          },
          {
            "time": "2019-11-26T00:00:00Z",
            "value": 11
          },
          {
            "time": "2019-11-27T00:00:00Z",
            "value": 11
          },
          {
            "time": "2019-11-28T00:00:00Z",
            "value": 11
          }
        ],
        "likeCount": [
          {
            "time": "2019-11-21T00:00:00Z",
            "value": 27892
          },
          {
            "time": "2019-11-22T00:00:00Z",
            "value": 28118
          },
          {
            "time": "2019-11-23T00:00:00Z",
            "value": 28256
          },
          {
            "time": "2019-11-24T00:00:00Z",
            "value": 28554
          },
          {
            "time": "2019-11-25T00:00:00Z",
            "value": 28804
          },
          {
            "time": "2019-11-26T00:00:00Z",
            "value": 28978
          },
          {
            "time": "2019-11-27T00:00:00Z",
            "value": 29192
          },
          {
            "time": "2019-11-28T00:00:00Z",
            "value": 29276
          }
        ],
        "commentCount": [
          {
            "time": "2019-11-21T00:00:00Z",
            "value": 1534
          },
          {
            "time": "2019-11-22T00:00:00Z",
            "value": 1534
          },
          {
            "time": "2019-11-23T00:00:00Z",
            "value": 1544
          },
          {
            "time": "2019-11-24T00:00:00Z",
            "value": 1550
          },
          {
            "time": "2019-11-25T00:00:00Z",
            "value": 1552
          },
          {
            "time": "2019-11-26T00:00:00Z",
            "value": 1552
          },
          {
            "time": "2019-11-27T00:00:00Z",
            "value": 1552
          },
          {
            "time": "2019-11-28T00:00:00Z",
            "value": 1552
          }
        ]
      }
    }
  },

  components: {
    dhHeader,
    dhFooter,
    dhCampaigns,
    VueC3
  },

  computed: {
    account() {
      const { currentAccount } = this.$store.state;

      return currentAccount
    },

    lastFollowerCount() {
      const { followerCount } = this.analyticInfo;

      if (!followerCount) return {}

      return followerCount[followerCount.length - 1]
    },

    lastLikeCount() {
      const { likeCount } = this.analyticInfo;

      if (!likeCount) return {}

      return likeCount[likeCount.length - 1]
    },

    lastCommentCount() {
      const { commentCount } = this.analyticInfo;

      if (!commentCount) return {}

      return commentCount[commentCount.length - 1]
    }
  },

  mounted() {
    const { followersGraph, likeGraph, commentGraph, account, analyticInfo } = this;
    const { followerCount, likeCount, commentCount } = analyticInfo;

    // axios({
    //   url: 'http://app13.directheroes.com:8080/api/v1/account/short-report',
    //   params: {
    //     username: 'absofacto' || account.login
    //   }
    // }).then(({ data }) => {
    //   console.log(data);

    // })

    this.$nextTick(() => {
      followersGraph.$emit('init', {
        data: {
          type: 'area',
          labels: false,
          columns: [
            ['Followers'].concat(followerCount.map(followerItem => followerItem.value))
          ]
        },
        size: {
          height: 80,
        },
        color: {
          pattern: ['#9E4CF9']
        },
        axis: {
          y: {
            show: false
          },
          x: {
            show: false
          }
        },
        legend: {
          hide: true
        }
      });

      likeGraph.$emit('init', {
        data: {
          type: 'area',
          labels: false,
          columns: [
            ['Likes'].concat(likeCount.map(likeItem => likeItem.value))
          ]
        },
        color: {
          pattern: ['#6DD230']
        },
        size: {
          height: 80,
        },
        axis: {
          y: {
            show: false
          },
          x: {
            show: false
          }
        },
        legend: {
          hide: true
        }
      });

      commentGraph.$emit('init', {
        data: {
          type: 'area',
          labels: false,
          columns: [
            ['Commemts'].concat(commentCount.map(commentItem => commentItem.value))
          ]
        },
        size: {
          height: 80,
        },
        color: {
          pattern: ['#FFAB2B']
        },
        axis: {
          y: {
            show: false
          },
          x: {
            show: false
          }
        },
        legend: {
          hide: true
        }
      })
    })
  }
}
</script>

<style lang="scss">
.dh-dashboard-view {
  .dh-dashboard-ig-account {
    padding: 31px 36px 35px 27px;
    border-radius: 4px;
    background-color: $sectionBG;
    min-height: 198px;
    display: flex;
    align-items: flex-start;
  }

  .dh-dashboard-userpic {
    width: 110px;
    height: 110px;
    background-color: rgba($borderColor, .5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
    margin-right: 42px;
  }

  .dh-dashboard-ig-account-info {
    flex-grow: 1;
  }

  .dh-dashboard-ig-account-main {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .dh-dashboard-ig-account-name {
    line-height: 22px;
    font-size: 18px
  }

  .dh-dashboard-ig-account-data  span {
    font-weight: 300;
    margin-left: 15px;
  }

  .dh-campaigns {
    margin-top: 46px;
  }

  .dh-dashboard-analytics {
    display: flex;
    max-width: 100%;
    justify-content: space-between;
    margin-top: 40px;
  }

  .dh-dashboard-analytics-item {
    background: #FFFFFF;
    border-radius: 4px;
    width: 30%;
    height: 100px;
    padding: 25px;
    display: flex;

    .dh-analytics-item-info {
      margin-right: 32px;
      flex-grow: 1;
      width: 20%;
      font-size: 26px;
    }

    .dh-analytics-item-graph {
       width: 80%;
    }

    .c3-line {
      stroke-width: 3px;
    }
  }
}
</style>