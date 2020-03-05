<template>
  <div class="dh-view dh-dashboard-view">
    <dh-header title="Dashboard"></dh-header>
    <div class="dh-view-content">
      <div class="dh-ig-account" v-if="currentAccount">
        <div class="dh-ig-account-userpic" :style="{'background-image': `url(${ currentAccount.profilePicUrl  })`}">
        </div>
        <div class="dh-ig-account-info">
          <div class="dh-ig-account-main">
            <div class="dh-ig-account-name">{{ currentAccount.login }}</div>
            <div class="dh-ig-account-data">
              <span><strong>{{ currentAccount.postCount || 0 }}</strong> posts</span>
              <span><strong>{{ currentAccount.followerCount || 0 }}</strong> followers</span>
              <span><strong>{{ currentAccount.followingCount || 0 }}</strong> following</span>
            </div>
          </div>
          <div class="dh-ig-account-bio" v-html="currentAccount.bio && currentAccount.bio.replace(/\n/g, '<br>')">
          </div>
        </div>
      </div>
      <div class="dh-dashboard-title">
        Stats
      </div>
      <div class="dh-dashboard-analytics">
        <el-tabs class="dh-tab" v-model="activeTab" @tab-click="onTabClick">
          <el-tab-pane class="dh-tab-pane" :label="tabs.Messages" :name="tabs.Messages">
            <div class="dh-tab-content dh-messages">
              <dhRangePicker
                :fromto="messagesAt"
                :granularity="true"
                @change="getMessagesRates"
              />
              <dhChart
                :columns="messagesRatesColumns"
                :ref="tabs.Messages"
                :options="messagesOptions"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Followers" :name="tabs.Followers">
            <div class="dh-tab-content">
              <!-- <dhRangePicker // Disabled until api 2.0 will not be released
                :fromto="messagesAt"
                :onChange="(dates) => console.log(dates)"
              /> -->
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
                    <dhChart
                      :columns="followersRatesColumns"
                      :options="simpleChartOptions('#9E4CF9')"
                      :ref="tabs.Followers"
                    />
                    <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': followerCountProgress > 0 }" v-if="followerCountProgress">
                      {{followerCountProgress.toFixed(2)}}%
                    </div>
                  </div>
              </div>
              <loader class="dh-dashboard-analytics-item" v-else />
            </div>
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Likes" :name="tabs.Likes">
            <div class="dh-tab-content">
              <!-- <dhRangePicker // Disabled until api 2.0 will not be released
                :fromto="messagesAt"
                :onChange="(dates) => console.log(dates)"
              /> -->
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
                  <dhChart
                    :columns="likeRatesColumns"
                    :options="simpleChartOptions('#6DD230')"
                    :ref="tabs.Likes"
                  />
                  <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': likeCountProgress > 0 }" v-if="likeCountProgress">
                    {{likeCountProgress.toFixed(2)}}%
                  </div>
                </div>
              </div>
              <loader class="dh-dashboard-analytics-item" v-else />
            </div>
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Comments" :name="tabs.Comments">
            <div class="dh-tab-content">
              <!-- <dhRangePicker // Disabled until api 2.0 will not be released
                :fromto="messagesAt"
                :onChange="(dates) => console.log(dates)"
              /> -->
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
                  <dhChart
                    :columns="commentRatesColumns"
                    :options="simpleChartOptions('#FFAB2B')"
                    :ref="tabs.Comments"
                  />
                  <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': commentCountProgress > 0 }" v-if="commentCountProgress">
                    {{commentCountProgress.toFixed(2)}}%
                  </div>
                </div>
              </div>
              <loader class="dh-dashboard-analytics-item" v-else />
            </div>
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
import axios from 'axios'
import dhChart from "../components/dh-chart";
import dhRangePicker from "../components/dh-range-picker";
import loader from "../components/dh-loader";

export default {
  data() {
    return {
      tabs: {
        Messages: "Messages",
        Followers: "Followers",
        Likes: "Likes",
        Comments: "Comments",
        Sent: "Reports",
        Seen: "Seen",
        Replied: "Replied"
      },
      options: {
        month: 2592000,
        day: 86400,
        hour: 3600
      },
      activeTab: "Messages",
      granularity: 86400,
      messagesAt: [new Date(moment().subtract(7, "days")), new Date()],
      analyticInfo: null,
      messagesRatesColumns: null,
      followersRatesColumns: null,
      likeRatesColumns: null,
      commentRatesColumns: null,
      interval: []
    };
  },

  components: {
    dhHeader,
    dhFooter,
    dhCampaigns,
    loader,
    dhChart,
    dhRangePicker
  },

  computed: {
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

    messagesOptions() {
      const { options, tabs } = this;
      const self = this;
      return {
        data: {
          x: null,
          xs: {
            [tabs.Sent]: 'x1',
            [tabs.Seen]: 'x2',
            [tabs.Replied]: 'x3'
          }
        },
        color: {
          pattern: ['#9E4CF9', '#6DD230', '#FFAB2B']
        },
        axis: {
          x: {
            tick: {
              format: function(e) {
                  const { granularity } = self;
                  switch (granularity) {
                    case options.hour: {
                      return moment(e).format("MM-DD hh:mm A");
                    }
                    case options.day: {
                      return moment(e).format("MM-DD");
                    }
                    case options.month: {
                      return moment(e).format("YYYY-MM");
                    }
                  }

                  return moment(e).format("YYYY-MM-DD");
              }
            }
          }
        }
      }
    }
  },

  methods: {
    onTabClick(tab) {
      const { name } = tab;
      const chart = this.$refs[name];
      if (chart) {
        chart.resize();
      }
    },

    simpleChartOptions(color) {
      return {
        data: {
          x: "x"
        },
        color: {
          pattern: [color]
        }
      }
    },

    getMessagesRates(interval, granularity) {
      const { currentAccount,
              tabs
            } = this;
      this.granularity = granularity;
      this.messagesRatesColumns = null;
      const [begin, end] = interval;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/message_rates/report`,
        params: {
          igAccountId: currentAccount.id,
          granularity: granularity,
          dateTimeSince: moment(begin).toISOString(),
          dateTimeTill: moment(end).toISOString()
        }
      }).then(({ data }) => {
        const { sent, seen, replied } = data.response.body;
        this.messagesRatesColumns = [
          ["x1"].concat(sent.map(c => moment(c.dateTime).toDate())),
          ["x2"].concat(seen.map(c => moment(c.dateTime).toDate())),
          ["x3"].concat(replied.map(c => moment(c.dateTime).toDate())),
          [tabs.Sent].concat(sent.map(c => c.value)),
          [tabs.Seen].concat(seen.map(c => c.value)),
          [tabs.Replied].concat(replied.map(c => c.value))
        ];
        this.messagesRatesFetching = false;
      });
    },

    getAnalyticInfoData(options) {
      const { followersGraph,
              likeGraph,
              commentGraph,
              currentAccount,
              tabs } = this;
       
      axios({
        url: 'https://igwm.directheroes.com/api/v1/account/short-report',
        params: {
          username: currentAccount.login
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
        if (followerCount) {
          this.followersRatesColumns = [
            ["x"].concat(
              followerCount.map(followerItem =>
                moment(followerItem.time).toDate()
              )
            ),
            [tabs.Followers].concat(followerCount.map(calcValues))
          ];
        }
        if (likeCount) {
          this.likeRatesColumns = [
              ["x"].concat(
                likeCount.map(likeItem => moment(likeItem.time).toDate())
              ),
              [tabs.Likes].concat(likeCount.map(calcValues))
          ]
        }

        if (commentCount) {
          this.commentRatesColumns = [
            ["x"].concat(
              commentCount.map(commentItem =>
                moment(commentItem.time).toDate()
              )
            ),
            [tabs.Comments].concat(commentCount.map(calcValues))
          ]
        }
      });
    },

    getAnalyticInfo() {
      const { getMessagesRates,
              getAnalyticInfoData,
              messagesAt, 
              granularity
            } = this;

      getMessagesRates(messagesAt, granularity);
      getAnalyticInfoData();
    }
  },

  mounted() {
    const { analyticInfo, $nextTick, getAnalyticInfo, currentAccount } = this;

    if (!analyticInfo || !currentAccount) return;

    $nextTick(() => {
      getAnalyticInfo();
    })
  },

  watch: {
    currentAccount(value) {
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

    .dh-tab-content:not(.dh-messages) {
      .dh-chart-wrapper {
        border: unset;
      }
    }
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
    margin-top: 22px;
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