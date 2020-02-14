<template>
  <div class="dh-view dh-campaign-perfomance-view">
    <dh-header title="Campaign Perfomance"></dh-header>
    <div class="dh-view-content">
      <el-tabs class="dh-tab" v-model="active" lazy>
        <el-tab-pane class="dh-tab-pane" label="Messages" name="Messages">
          <div class="dh-perfomance-title">Stats</div>
          <div class="dh-charts-container">
            <div class="dh-chart dh-messages-sent">
              <el-date-picker
                v-model="messagesAt"
                size="small"
                type="daterange"
                start-placeholder="date since"
                end-placeholder="date till"
                class="dh-chart-time-picker"
                range-separator="To"
                :picker-options="pickerOptions"
              ></el-date-picker>
              <div class="dh-chart-item-wrapper" v-bind:class="{ active :!chartFetching }">
                <vue-c3 class="dh-chart-item" :handler="messagesChart"></vue-c3>
              </div>
            </div>
          </div>
          <div class="dh-campaign-controls">
            <div class="dh-select dh-campaign-subscription">
              <div class="dh-select-title">Subscription</div>
              <el-select
                v-model="filters.subscribed"
                @change="getStatistics"
                size="small"
                popper-class="dh-select-popper"
              >
                <el-option label="All" :value="null"></el-option>
                <el-option label="Subscribed" :value="true"></el-option>
                <el-option label="Unsubscribed" :value="false"></el-option>
              </el-select>
            </div>
            <div class="dh-divider"></div>
            <div class="dh-filter">
              <el-popover
                placement="bottom"
                trigger="click"
                popper-class="dh-category-filter-popover"
                :width="300"
              >
                <div class="dh-options" v-if="account">
                  <div class="dh-option">has any of</div>
                  <div class="dh-select-wrapper">
                    <el-select
                      v-model="filters.categories.in"
                      multiple
                      placeholder="Select category"
                    >
                      <el-option
                        v-for="category in categories"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="dh-option">has none of</div>
                  <div class="dh-select-wrapper">
                    <el-select
                      v-model="filters.categories.nin"
                      multiple
                      placeholder="Select category"
                    >
                      <el-option
                        v-for="category in categories"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <template slot="reference">
                  <div class="dh-filter-wrapper">
                    <div class="dh-filter-title">Categories</div>
                    <div
                      :class="{'dh-filter-info': true, 'dh-filter-selected': categoriesFilterText }"
                    >{{categoriesFilterText || 'All'}}</div>
                  </div>
                </template>
              </el-popover>
            </div>
            <div class="dh-divider"></div>
            <div class="dh-search-input">
              <search />
              <input
                type="text"
                class="dh-input"
                placeholder="Type to search"
                v-model="filters.usernameQuery"
                @keypress.enter="getStatistics"
              />
            </div>
            <span></span>
            <button class="dh-button dh-small" @click="isExportData = true">Export</button>
          </div>
          <div class="dh-list" v-if="threads">
            <router-link
              class="dh-list-item"
              :to="{ name: 'livechat', params: { threadId: thread.id }, query: {p: paging.page, q: filters.usernameQuery, sub: subscribedText }}"
              v-for="thread in threads"
              :key="thread.id"
            >
              <div
                class="dh-thread-userpic"
                :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl  })`}"
              ></div>
              <div class="dh-thread-data-item dh-thread-username">
                <div class="dh-thread-data-item-main">{{thread.contactProfile.fullName}}</div>
                {{thread.contactProfile.username}}
              </div>
              <div class="dh-thread-data-item">
                <template v-if="fromNowDate(thread.subscribedAt)">
                  <div class="dh-thread-data-item-main">{{fromNowDate(thread.subscribedAt)}}</div>Entered
                </template>
              </div>
              <div class="dh-thread-data-item">
                <div class="dh-thread-data-item-main">{{fromNowDate(thread.lastMessageAt)}}</div>Last campaign activity
              </div>
              <div class="dh-thread-data-item" v-if="thread.campaignList.length">
                <div class="dh-thread-data-item-main">{{thread.campaignList.length}}</div>Campaigns
              </div>
              <div class="dh-spacer"></div>
              <router-link
                :to="{ name: 'livechat', params: { threadId: thread.id }, query: {p: paging.page, q: filters.usernameQuery, sub: subscribedText }}"
                tag="div"
                class="dh-thread-controls"
              >
                <livechat />
              </router-link>
            </router-link>
          </div>
          <loader v-else />
        </el-tab-pane>
      </el-tabs>
    </div>
    <dh-export-dialog
      v-model="isExportData"
      v-if="isExportData"
      :campaigns="JSON.parse(JSON.stringify(filters.campaigns))"
      :categories="JSON.parse(JSON.stringify(filters.categories))"
    ></dh-export-dialog>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from "../components/dh-header";
import dhFooter from "../components/dh-footer";
import dhExportDialog from "../components/dh-export-dialog";
import Vue from "vue";
import moment from "moment";
import VueC3 from "vue-c3";
import axios from "axios";
import search from "../assets/search.svg";
import livechat from "../assets/livechat.svg";
import loader from "../components/dh-loader";

export default {
  name: "CampaignStatistics",

  components: {
    dhHeader,
    dhFooter,
    VueC3,
    search,
    livechat,
    dhExportDialog,
    loader
  },

  data: () => ({
    active: "Messages",
    status: "audience",
    messagesChart: new Vue(),
    pickerOptions: {
      shortcuts: [
        {
          text: "Last week",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "Last month",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "Last 3 months",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "Last year",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit("pick", [start, end]);
          }
        }
      ]
    },
    isExportData: false,
    paging: {
      page: 1,
      totalPageCount: 1
    },
    filters: {
      subscribed: true,
      usernameQuery: "",
      campaigns: {
        in: []
      },
      categories: {
        in: [],
        nin: []
      }
    },
    chartFetching: false,
    threads: [],
    defaultDateTimeBegin: new Date(moment().subtract(7, "days")),
    defaultDateTimeEnd: new Date(),
    interval: [],
    granularity: {
      options: {
        day: 86400,
        hour: 3600,
        five_minutes: 300
      }
    },
    debounce: -1
  }),

  watch: {
    "filters.categories": {
      handler() {
        const { getStatistics } = this;

        clearTimeout(this.debounce);

        this.debounce = setTimeout(this.getStatistics, 2500);
      },
      deep: true
    }
  },

  computed: {
    categories() {
      const { subscriberCategoryList } = this.account;

      return subscriberCategoryList;
    },

    categoriesFilterText() {
      const { categories } = this.filters;
      let filterText = "";

      if (categories.in.length) {
        filterText += `${categories.in.length} selected`;
      }

      if (categories.nin.length) {
        filterText +=
          (filterText ? ", " : "") + `${categories.nin.length} excluded`;
      }

      return filterText;
    },

    messagesAt: {
      get() {
        if (!this.interval.length) {
          return [this.defaultDateTimeBegin, this.defaultDateTimeEnd];
        }

        return this.interval;
      },
      set(value) {
        if (!value) {
          value = [this.defaultDateTimeBegin, this.defaultDateTimeEnd];
        }

        let [begin, end] = value;
        if (begin.getTime() === end.getTime()) {
          begin = begin - 1;
        }

        this.interval = [begin, end];
        this.chartPatch();
      }
    },

    subscribedText() {
      const { subscribed } = this.filters;

      switch (subscribed) {
        case false:
          return "unsubscribed";
          break;
        case null:
          return "all";
          break;
        case "ignored":
          return "ignored";
          break;
      }
    },

    account() {
      return this.$store.state.currentAccount;
    }
  },

  mounted() {
    const { campaignId } = this.$route.params;
    this.filters.campaigns.in.push(campaignId);
    this.getStatistics();
    this.chartInitialize();
  },

  methods: {
    fromNowDate(date) {
      const momentDate = moment(new Date(date * 1000));

      return momentDate.isValid() && moment(new Date(date * 1000)).fromNow();
    },

    chartPatch() {
      this.chartFetch(data => {
        const { sent, seen, replied } = data.response.body;
        const dates = sent.map(c => moment(c.dateTime).toDate());
        this.messagesChart.$emit("dispatch", chart => {
          chart.load({
            columns: [
              ["x"].concat(dates),
              ["Sent"].concat(sent.map(c => c.value)),
              ["Seen"].concat(seen.map(c => c.value)),
              ["Replied"].concat(replied.map(c => c.value))
            ]
          });

          chart.zoom([
            new Date(Math.min.apply(null, dates)),
            new Date(Math.max.apply(null, dates))
          ]);
        });
      });
    },

    chartInitialize() {
      this.chartFetch(data => {
        const { sent, seen, replied } = data.response.body;

        this.$nextTick(() => {
          this.messagesChart.$emit(
            "init",
            this.chartModel(() => {
              return {
                x: ["x"].concat(sent.map(c => moment(c.dateTime).toDate())),
                sent: ["Sent"].concat(sent.map(c => c.value)),
                seen: ["Seen"].concat(seen.map(c => c.value)),
                replied: ["Replied"].concat(replied.map(c => c.value))
              };
            })
          );
        });
      });
    },

    chartFetch(onSuccess) {
      this.chartFetching = true;
      const { options } = this.granularity;
      const { campaignId, accountId } = this.$route.params;
      const [begin, end] = this.messagesAt;
      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/message_rates/report`,
        params: {
          igAccountId: accountId,
          granularity: options.day,
          dateTimeSince: moment(begin).toISOString(),
          dateTimeTill: moment(end).toISOString(),
          campaignId
        }
      }).then(({ data }) => {
          if (onSuccess) {
            onSuccess(data);
          }
        }).finally(_ => {
          this.chartFetching = false;
        });
    },

    getStatistics() {
      const { accountId } = this.$route.params;
      const { status, paging, filters } = this;
      this.threads = null;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/thread/list/ig_account/${accountId}/${status}`,
        method: "post",
        data: { paging, ...filters }
      }).then(({ data }) => {
        const { threadList, paging } = data.response.body;

        this.threads = threadList;
        this.paging = paging;
      });
    },

    getMinOrDefault(dateTimes, comparator) {
      const min = comparator ? comparator : this.defaultDateTimeBegin;
      let d_min = new Date(Math.min.apply(null, dateTimes));
      d_min = d_min > min ? d_min : min;
      return d_min;
    },

    getMaxOrDefault(dateTimes, comparator) {
      const max = comparator ? comparator : this.defaultDateTimeEnd;
      let d_max = new Date(Math.max.apply(null, dateTimes));
      d_max = d_max < max ? d_max : max;
      return d_max;
    },

    chartModel(builder) {
      const b = builder();
      const [begin, end] = this.messagesAt;
      let ranges = [begin, end];

      return {
        padding: {
          right: 10,
          left: 10
        },
        data: {
          x: "x",
          xFormat: "%Y-%m-%d",
          type: "line",
          labels: true,
          columns: [b.x, b.sent, b.seen, b.replied]
        },
        tooltip: {
          format: {
            value(value, ratio, id, index) {
              return value;
            }
          }
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
                max: 20
              },
              format: function(e) {
                const [begin, end] = ranges;
                if (
                  begin.getDate() === end.getDate() &&
                  begin.getMonth() == end.getMonth()
                ) {
                  if (begin.getHours() === end.getHours()) {
                    return moment(e).format("HH:MM:SS");
                  }
                  return moment(e).format("HH:MM:SS");
                }
                if (begin.getMonth() === end.getMonth()) {
                  return moment(e).format("MM-DD-ddd");
                }
                return moment(e).format("YYYY-MM-DD");
              }
            }
          }
        },
        legend: {
          hide: false
        },
        zoom: {
          enabled: true,
          rescale: true,
          onzoom: function(domain) {
            ranges = domain;
          }
        },
        transition: {
          duration: 1000
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.dh-charts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 10px 0 0;

  .dh-chart {
    background-color: #fff;
    border-radius: 4px;
    width: 100%;
    min-width: 350px;
    margin-bottom: 15px;

    .dh-chart-time-picker {
      width: 100%;
    }

    .dh-chart-item-wrapper {
      opacity: 0.2;

      &.active {
        opacity: 1;
      }
    }

    .dh-chart-item {
      width: 100%;
      height: 160px;

      path.domain {
        stroke: #778ca2;
      }

      g.c3-axis.c3-axis-x {
        fill: #98a9bc;
      }
    }
  }
}

.dh-tab-pane {
  .dh-campaign-controls {
    display: flex;
    flex-wrap: wrap;

    & > span {
      flex-grow: 1;
    }

    .dh-campaign-subscription {
      margin-right: 20px;

      .el-select {
        width: 140px;
      }
    }
  }

  .dh-thread-userpic {
    width: 40px;
    height: 40px;
    background-color: rgba($borderColor, 0.5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
  }

  .dh-thread-data-item {
    width: 17%;
    flex-shrink: 0;
    color: $textColor;
  }

  .dh-thread-username {
    margin-left: 24px;
    width: 25%;
  }

  .dh-thread-data-item-main {
    font-size: 18px;
    line-height: 22px;
    color: $mainTextColor;
  }

  .dh-campaign-controls {
    display: flex;
    flex-wrap: wrap;

    & > span {
      flex-grow: 1;
    }

    .dh-filter {
      display: flex;
      align-items: center;

      .dh-filter-wrapper {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        font-weight: 500;
        font-size: 12px;
        cursor: pointer;
      }

      .dh-filter-title {
        color: #98a9bc;
        margin-right: 12px;
      }
    }

    .dh-divider {
      border-right: 1px solid rgba($textColor, 0.5);
      height: 36px;
      margin: 0 15px;
    }
  }
}

.dh-perfomance-title {
  color: $elementsColor;
  font-size: 18px;
  padding: 26px 0 24px 0;
}
</style>

<style >
path.domain {
  stroke: #778ca2;
}

g.c3-axis.c3-axis-x {
  fill: #778ca2;
}
.tick line {
  stroke: #98a9bc;
}
</style>
