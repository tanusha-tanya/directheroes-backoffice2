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
            <div :class="{'dh-analytics-item-value': true,'dh-analytics-success': followerCountProgress > 0 }">
              {{lastFollowerCount.value.toLocaleString()}}
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="followerCountProgress">
                <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="dh-analytics-item-title">
              Followers
            </div>
          </div>
          <div class="dh-analytics-item-graph">
            <vue-c3 :handler="followersGraph"></vue-c3>
            <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': followerCountProgress > 0 }" v-if="followerCountProgress">
              {{followerCountProgress.toFixed(2)}}%
            </div>
          </div>
        </div>
        <div class="dh-dashboard-analytics-item">
          <div class="dh-analytics-item-info">
            <div :class="{'dh-analytics-item-value': true,'dh-analytics-success': likeCountProgress > 0 }">
              {{lastLikeCount.value.toLocaleString()}}
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="likeCountProgress">
                <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="dh-analytics-item-title">
              Likes
            </div>
          </div>
          <div class="dh-analytics-item-graph">
            <vue-c3 :handler="likeGraph"></vue-c3>
            <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': likeCountProgress > 0 }" v-if="likeCountProgress">
              {{likeCountProgress.toFixed(2)}}%
            </div>
          </div>
        </div>
        <div class="dh-dashboard-analytics-item">
          <div class="dh-analytics-item-info">
            <div  :class="{'dh-analytics-item-value': true, 'dh-analytics-success': commentCountProgress > 0 }">
              {{lastCommentCount.value.toLocaleString()}}
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="commentCountProgress">
                <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="dh-analytics-item-title">
              Comments
            </div>
          </div>
          <div class="dh-analytics-item-graph">
            <vue-c3 :handler="commentGraph"></vue-c3>
            <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': commentCountProgress > 0 }" v-if="commentCountProgress">
              {{commentCountProgress.toFixed(2)}}%
            </div>
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

    followerCountProgress() {
      const { followerCount } = this.analyticInfo;

      if (!followerCount || !followerCount.length) return;

      const firstElement = followerCount[0];
      const lastElement = followerCount[followerCount.length - 1];
      const delta = lastElement.value - firstElement.value;

      return delta * 100 / lastElement.value
    },

    lastLikeCount() {
      const { likeCount } = this.analyticInfo;

      if (!likeCount) return {}

      return likeCount[likeCount.length - 1]
    },

    likeCountProgress() {
      const { likeCount } = this.analyticInfo;

      if (!likeCount || !likeCount.length) return;

      const firstElement = likeCount[0];
      const lastElement = likeCount[likeCount.length - 1];
      const delta = lastElement.value - firstElement.value;

      return delta * 100 / lastElement.value
    },

    lastCommentCount() {
      const { commentCount } = this.analyticInfo;

      if (!commentCount) return {}

      return commentCount[commentCount.length - 1]
    },

    commentCountProgress() {
      const { commentCount } = this.analyticInfo;

      if (!commentCount || !commentCount.length) return;

      const firstElement = commentCount[0];
      const lastElement = commentCount[commentCount.length - 1];
      const delta = lastElement.value - firstElement.value;

      return delta * 100 / lastElement.value
    },
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
       position: relative;
    }

    .dh-analytics-item-value {
      white-space: nowrap;

      svg {
        display: inline-block;
        margin-bottom: 6px;
        color: #FE4D97;
        transform: rotate(180deg)
      }

      &.dh-analytics-success {
        svg {
          display: inline-block;
          margin-bottom: 6px;
          color: #6DD230;
          transform: rotate(0)
        }
      }
    }

    .dh-analytics-item-title {
      font-size: 14px;
      color: #98A9BC;
      margin-top: 7px;
    }

    .dh-analytics-item-profit {
      color: #FE4D97;
      position: absolute;
      bottom: 0;
      right: 5px;

      &.dh-analytics-success {
        color: #6DD230;

        &:before {
          content: '+';
        }
      }
    }

    .c3-line {
      stroke-width: 3px;
    }

    // .c3-areas-Followers {
    //   fill: url(#follower-linear-gradient);

    //   path {
    //     fill: inherit !important;
    //     opacity: 1 !important;
    //   }
    // }
  }
}
</style>