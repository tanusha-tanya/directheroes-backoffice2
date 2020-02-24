<template>
  <div class="dh-view dh-dashboard-view">
    <dh-header title="Dashboard"></dh-header>
    <div class="dh-view-content">
      <div class="dh-ig-account" v-if="account">
        <div class="dh-ig-account-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
        </div>
        <div class="dh-ig-account-info">
          <div class="dh-ig-account-main">
            <div class="dh-ig-account-name">{{ account.login }}</div>
            <div class="dh-ig-account-data">
              <span><strong>{{ account.postCount || 0 }}</strong> posts</span>
              <span><strong>{{ account.followerCount || 0 }}</strong> followers</span>
              <span><strong>{{ account.followingCount || 0 }}</strong> following</span>
            </div>
          </div>
          <div class="dh-ig-account-bio" v-html="account.bio && account.bio.replace(/\n/g, '<br>')">
          </div>
        </div>
      </div>
      <div class="dh-dashboard-title">
        Stats
      </div>
      <div class="dh-dashboard-analytics">
        <el-tabs class="dh-tab" v-model="activeTab" @tab-click="onTabClick">
          <el-tab-pane class="dh-tab-pane" :label="tabs.Messages" :name="tabs.Messages">
            <div class="dh-dashboard-analytics-item" v-if="messagesRates">
              <div class="dh-analytics-item-graph dh-full-chart">
                <vue-c3 class="dh-chart-item" :handler="messagesChart"></vue-c3>
              </div>
            </div>
            <loader class="dh-dashboard-analytics-item" v-else />
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Followers" :name="tabs.Followers">
            <div class="dh-dashboard-analytics-item dh-inform" v-if="analyticInfo && hasThreeDays && analyticInfo.followerCount">
              <div class="dh-analytics-item-info" >
                <div :class="{'dh-analytics-item-value': true,'dh-analytics-success': followerCountProgress > 0 }">
                  {{deltaFollowerCount.toLocaleString()}}
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="followerCountProgress">
                    <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
                  </svg>
                </div>
                </div>
                <div class="dh-analytics-item-graph">
                  <vue-c3 class="dh-chart-item" :handler="followersGraph"></vue-c3>
                  <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': followerCountProgress > 0 }" v-if="followerCountProgress">
                    {{followerCountProgress.toFixed(2)}}%
                  </div>
                </div>
            </div>
            <loader class="dh-dashboard-analytics-item" v-else />
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Likes" :name="tabs.Likes">
            <div class="dh-dashboard-analytics-item dh-inform" v-if="analyticInfo && hasThreeDays && analyticInfo.likeCount">
              <div class="dh-analytics-item-info">
                <div :class="{'dh-analytics-item-value': true,'dh-analytics-success': likeCountProgress > 0 }">
                  {{deltaLikeCount.toLocaleString()}}
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="likeCountProgress">
                    <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div class="dh-analytics-item-graph">
                <vue-c3 class="dh-chart-item" :handler="likeGraph"></vue-c3>
                <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': likeCountProgress > 0 }" v-if="likeCountProgress">
                  {{likeCountProgress.toFixed(2)}}%
                </div>
              </div>
            </div>
            <loader class="dh-dashboard-analytics-item" v-else />
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Comments" :name="tabs.Comments">
            <div class="dh-dashboard-analytics-item" v-if="analyticInfo && hasThreeDays && analyticInfo.commentCount">
              <div class="dh-analytics-item-info">
                <div  :class="{'dh-analytics-item-value': true, 'dh-analytics-success': commentCountProgress > 0 }">
                  {{deltaCommentCount.toLocaleString()}}
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="commentCountProgress">
                    <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div class="dh-analytics-item-graph">
                <vue-c3 class="dh-chart-item" :handler="commentGraph"></vue-c3>
                <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': commentCountProgress > 0 }" v-if="commentCountProgress">
                  {{commentCountProgress.toFixed(2)}}%
                </div>
              </div>
            </div>
            <loader class="dh-dashboard-analytics-item" v-else />
          </el-tab-pane>
        </el-tabs>
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
import moment from 'moment'
import Vue from 'vue'
import axios from 'axios'
import VueC3 from 'vue-c3'
import loader from "../components/dh-loader";

export default {
  data() {
    return {
      followersGraph: new Vue(),
      likeGraph: new Vue(),
      commentGraph: new Vue(),
      messagesChart: new Vue(),
      tabs: {
        Messages: "Messages",
        Followers: "Followers",
        Likes: "Likes",
        Comments: "Comments",
      },
      activeTab: "Messages",
      granularityDay: 86400,
      defaultDateTimeBegin: new Date(moment().subtract(7, "days")),
      defaultDateTimeEnd: new Date(),
      analyticInfo: null,
      messagesRates: null
    }
  },

  components: {
    dhHeader,
    dhFooter,
    dhCampaigns,
    VueC3,
    loader
  },

  computed: {
    account() {
      const { currentAccount } = this.$store.state;

      return currentAccount
    },

    hasThreeDays() {
      const { followerCount } = this.analyticInfo;

      if (!followerCount) return

      return followerCount.length > 3;
    },

    deltaFollowerCount() {
      const { followerCount } = this.analyticInfo;

      if (!followerCount) return {}

      return Math.floor(followerCount[followerCount.length - 1].value - followerCount[0].value)
    },

    followerCountProgress() {
      const { followerCount } = this.analyticInfo;

      if (!followerCount || !followerCount.length) return;

      const lastElement = followerCount[followerCount.length - 1];
      const { deltaFollowerCount }= this;

      return deltaFollowerCount * 100 / lastElement.value
    },

    deltaLikeCount() {
      const { likeCount } = this.analyticInfo;

      if (!likeCount) return {}

      return likeCount[likeCount.length - 1].value - likeCount[0].value
    },

    likeCountProgress() {
      const { likeCount } = this.analyticInfo;

      if (!likeCount || !likeCount.length) return;

      const lastElement = likeCount[likeCount.length - 1];
      const { deltaLikeCount } = this;

      return deltaLikeCount * 100 / lastElement.value
    },

    deltaCommentCount() {
      const { commentCount } = this.analyticInfo;

      if (!commentCount) return {}

      return commentCount[commentCount.length - 1].value - commentCount[0].value
    },

    commentCountProgress() {
      const { commentCount } = this.analyticInfo;

      if (!commentCount || !commentCount.length) return;

      const lastElement = commentCount[commentCount.length - 1];
      const { deltaCommentCount } = this;

      return deltaCommentCount * 100 / lastElement.value
    },
  },

  methods: {
    onTabClick(tab) {
      const { name } = tab;
      const { messagesChart, followersGraph, likeGraph, commentGraph, tabs } = this;

      let chart = messagesChart;
      if (name === tabs.Followers) {
        chart = followersGraph;
      } else if (name === tabs.Likes) {
        chart = likeGraph;
      } else if (name === tabs.Comments) {
        chart = commentGraph;
      }
      this.$nextTick(() => {
        chart.$emit("dispatch", c => {
          c.resize();
        })
      });
    },

    getAnalyticInfo() {
      const { followersGraph, 
              likeGraph, 
              commentGraph, 
              account, 
              granularityDay, 
              defaultDateTimeBegin, 
              defaultDateTimeEnd 
            } = this;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/message_rates/report`,
        params: {
          igAccountId: account.id,
          granularity: granularityDay,
          dateTimeSince: moment(defaultDateTimeBegin).toISOString(),
          dateTimeTill: moment(defaultDateTimeEnd).toISOString()
        }
      }).then(({ data }) => {
        const { sent, seen, replied } = data.response.body;
        this.messagesRates = {
          sent,
          seen,
          replied
        };
          this.$nextTick(() => {
            this.messagesChart.$emit("init", {
              padding: {
                left: 15,
                right: 15
              },
              data: {
                x: "x",
                xFormat: "%Y-%m-%d",
                type: "line",
                labels: false,
                columns: [
                  ["x"].concat(sent.map(c => moment(c.dateTime).toDate())),
                  ["Sent"].concat(sent.map(c => c.value)),
                  ["Seen"].concat(seen.map(c => c.value)),
                  ["Replied"].concat(replied.map(c => c.value))
                ]
              },
              tooltip: {
                format: {
                  value(value, ratio, id, index) {
                    return value;
                  }
                }
              },
              color: {
                pattern: ["#9E4CF9", "#6DD230", "#FFAB2B"]
              },
              axis: {
                y: {
                  show: false
                },
                x: {
                  show: true,
                  type: "timeseries",
                  tick: {
                    culling: {
                      max: 10
                    },
                    format: function(e) {
                      return moment(e).format("YYYY-MM-DD");
                    }
                  }
                }
              },
              legend: {
                hide: false
              },
              transition: {
                duration: 1000
              }
            });
        });
      })

      axios({
        url: 'https://igwm.directheroes.com/api/v1/account/short-report',
        params: {
          username: account.login
        }
      }).then(({ data }) => {
        const analyticInfo = data.reports;
        let { followerCount, likeCount, commentCount } = analyticInfo;
        const checkValues = (accumulator, currentValue, index) => {
          const { value } = currentValue;
          const prevValue = accumulator[index - 1];
          currentValue.value = [-1, '-1', null].includes(value) ? ((prevValue && prevValue.value) || 0) : value;

          accumulator.push(currentValue);

          return accumulator;
        }
        const calcValues = (item, index, array) => {
          if (!index) return 0;

          return (item.value - array[0].value).toFixed(0);
        }

        followerCount = followerCount && followerCount.reduce(checkValues, []);
        likeCount = likeCount && likeCount.reduce(checkValues, []);
        commentCount = commentCount && commentCount.reduce(checkValues, []);

        if ( !followerCount && !likeCount && !commentCount) return;

        this.analyticInfo = analyticInfo;

        this.$nextTick(() => {
          if (followerCount) {
            followersGraph.$emit('init', {
              padding: {
                top: 10,
                right: 15,
                left: 15
              },
              data: {
                x: 'x',
                xFormat: '%Y-%m-%d',
                type: 'area',
                labels: false,
                columns: [
                  ['x'].concat(followerCount.map(followerItem => moment(followerItem.time).toDate())),
                  ['Followers'].concat(followerCount.map(calcValues))
                ]
              },
              tooltip: {
                format: {
                  value(value, ratio, id, index) {
                    return Math.floor(followerCount[index].value);
                  }
                }
              },
              color: {
                pattern: ['#9E4CF9']
              },
              axis: {
                y: {
                  show: false
                },
                x: {
                  show: true,
                  type: 'timeseries',
                  tick: {
                    format: '%Y-%m-%d'
                  }
                }
              },
              legend: {
                hide: false
              }
            });
          }

          if (likeCount) {
            likeGraph.$emit('init', {
              padding: {
                top: 10,
                right: 15,
                left: 15
              },
              data: {
                x: 'x',
                xFormat: '%Y-%m-%d',
                type: 'area',
                labels: false,
                columns: [
                  ['x'].concat(likeCount.map(likeItem => moment(likeItem.time).toDate())),
                  ['Likes'].concat(likeCount.map(calcValues))
                ]
              },
              color: {
                pattern: ['#6DD230']
              },
              tooltip: {
                format: {
                  value(value, ratio, id, index) {
                    return Math.floor(likeCount[index].value);
                  }
                }
              },
              axis: {
                y: {
                  show: false
                },
                x: {
                  show: true,
                  type: 'timeseries',
                  tick: {
                    format: '%Y-%m-%d'
                  }
                }
              },
              legend: {
                hide: false
              }
            });
          }

          if (commentCount) {
            commentGraph.$emit('init', {
              padding: {
                top: 10,
                right: 15,
                left: 15
              },
              data: {
                x: 'x',
                xFormat: '%Y-%m-%d',
                type: 'area',
                labels: false,
                columns: [
                  ['x'].concat(commentCount.map(commentItem => moment(commentItem.time).toDate())),
                  ['Comments'].concat(commentCount.map(calcValues))
                ]
              },
              tooltip: {
                format: {
                  value(value, ratio, id, index) {
                    return Math.floor(commentCount[index].value);
                  }
                }
              },
              color: {
                pattern: ['#FFAB2B']
              },
              axis: {
                y: {
                  show: false
                },
                x: {
                  show: true,
                  type: 'timeseries',
                  tick: {
                    format: '%Y-%m-%d'
                  }
                }
              },
              legend: {
                hide: false
              }
            })
          }
        })
      })
    }
  },

  mounted() {
    const { analyticInfo, $nextTick, getAnalyticInfo, account } = this;

    if (!analyticInfo || !account) return;
    $nextTick(() => {
      getAnalyticInfo();
    })
  },

  watch: {
    account(value) {
      const { getAnalyticInfo, _isMounted } = this;

      if (!value || !_isMounted) return;

      getAnalyticInfo();
    }
  }
}
</script>

<style lang="scss">
.dh-dashboard-view {
  .dh-campaigns {
    margin-top: 46px;
  }

  .dh-dashboard-title {
    font-size: 18px;
    line-height: 22px;
    margin-top: 46px;
    color: #778CA2;
  }

  .dh-dashboard-analytics {
    display: flex;
    max-width: 100%;
    justify-content: space-between;
    margin-top: 24px;
  }

  .dh-chart-item {
    height: 160px;

    path.domain {
      stroke: #778ca2;
    }

    g.c3-axis.c3-axis-x {
      fill: #98a9bc;
    }
  }

  .dh-dashboard-analytics-item {
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E8ECEF;
    display: flex;
    padding: 0 10px;

    .dh-analytics-item-info {
      margin: 0 16px;
      font-size: 19px;
      align-self: center;
      width: 100px;
      flex: 0 1 100px;
    }

    .dh-analytics-item-graph {
        position: relative;
        width: calc(100% - 100px);

        &.dh-full-chart {
          width: 100%;
        }
    }

    .dh-analytics-item-value {
      white-space: nowrap;

      svg {
        display: inline-block;
        margin-bottom: 2px;
        color: #FE4D97;
        transform: rotate(180deg)
      }

      &.dh-analytics-success {
        svg {
          display: inline-block;
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
      bottom: 60px;
      right: 25px;
      font-weight: 500;

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

    .c3-chart {
      clip-path: unset !important;
    }
  }
}
</style>