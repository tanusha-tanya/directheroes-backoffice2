<template>
  <div class="dh-view dh-campaign-perfomance-view">
    <dh-header title="Campaign Perfomance"></dh-header>
    <div class="dh-view-content">
      <el-tabs class="dh-tab" v-model="active" lazy>
        <el-tab-pane class="dh-tab-pane" label="Messages" name="Messages">
          <div class="dh-chart">
            <!-- <dhRangePicker :fromto="messagesAt" :granularity="true" @change="chartFetch" /> -->

            <dhAccountChart
              :columns="messagesChartColumns"
              :options="messagesOptions"
              :fetching="messagesChartFetching"
            />
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
              <div class="dh-thread-data-item">
                <div class="dh-thread-data-item-main">{{thread.status}}</div>Status
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
          <div class="dh-statistic-thread-controls" v-if="threads">
            <div class="dh-statistic-thread-info">Total subscribers: {{ paging.totalResultCount }}</div>
            <el-pagination
              background
              layout="prev, pager, next"
              :current-page="paging.page"
              :page-count="paging.totalPageCount"
              @current-change="changePage"
              v-if="threads && paging && paging.totalPageCount > 1"
            ></el-pagination>
          </div>
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
import axios from "axios";
import search from "../assets/search.svg";
import livechat from "../assets/livechat.svg";
import loader from "../components/dh-loader";
import dhAccountChart from "../components/dh-account-chart";
import dhRangePicker from "../components/dh-range-picker";
import utils from "../../oldJS/utils";

export default {
  name: "CampaignStatistics",

  components: {
    dhHeader,
    dhFooter,
    dhAccountChart,
    search,
    livechat,
    dhExportDialog,
    loader,
    dhRangePicker
  },

  data: () => ({
    active: "Messages",
    status: "audience",
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
    messagesAt: [new Date(moment().subtract(14, "days")), new Date()],
    options: {
      month: 2592000,
      day: 86400,
      hour: 3600
    },
    granularity: 86400,
    graphs: {
      Sent: "Sent",
      Seen: "Seen",
      Replied: "Replied"
    },
    messagesChartColumns: [],
    messagesChartFetching: false,
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
    },

    messagesOptions() {
      const { options, graphs } = this;
      const self = this;
      return {
        data: {
          x: "x"
        },
        color: {
          pattern: ["#9E4CF9", "#6DD230", "#FFAB2B"]
        },
        tooltip: {
          format: {
            value(value, ratio, id, index) {
              if (id !== self.graphs.Sent && self.messagesChartColumns) {
                const sentSet = self.messagesChartColumns.find(c => c[0] == self.graphs.Sent);
                if (sentSet) {
                  const sentValue = sentSet.slice(1)[index];
                  const percent = ((100 * value) / sentValue).toFixed(2);
                  if (Number.isNaN(percent) || percent === "NaN") {
                    return value;
                  }
                  return `${value} - ${percent}%`;
                }
              }

              return value;
            }
          }
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
      };
    }
  },

  mounted() {
    const { campaignId } = this.$route.params;
    const { filters, getStatistics, chartFetch, options, messagesAt } = this;
    filters.campaigns.in.push(campaignId);
    getStatistics();
    chartFetch(messagesAt, options.day);
  },

  methods: {
    fromNowDate(date) {
      const momentDate = moment(new Date(date * 1000));

      return momentDate.isValid() && moment(new Date(date * 1000)).fromNow();
    },

    changePage(page) {
      this.paging.page = page;
      this.getStatistics();
    },

    dataRangeDifference(range) {
      const [begin, end] = range;
      const diff = moment(end).diff(begin);
      return moment.duration(diff).asDays() + 1 / 30;
    },

    chartFetch(interval, granularity) {
      this.messagesChartColumns = null;
      this.messagesChartFetching = true;
      this.granularity = granularity;
      const { graphs } = this;
      const { campaignId, accountId } = this.$route.params;
      const [begin, end] = interval;
      const datesFiller = utils.fillDates(begin, end, granularity);
      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/message_rates/report`,
        params: {
          igAccountId: accountId,
          granularity: granularity,
          dateTimeSince: moment(begin).toISOString(),
          dateTimeTill: moment(end).toISOString(),
          campaignId
        }
      })
        .then(({ data }) => {
          const { sent, seen, replied } = data.response.body;
          this.messagesChartColumns = [
            ["x"].concat(datesFiller.Dates().map(c => moment(c).toDate())),
            [graphs.Sent].concat(datesFiller.Fill(sent).map(c => c.value)),
            [graphs.Seen].concat(datesFiller.Fill(seen).map(c => c.value)),
            [graphs.Replied].concat(datesFiller.Fill(replied).map(c => c.value))
          ];
        })
        .finally(() => (this.messagesChartFetching = false));
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
    }
  }
};
</script>

<style lang="scss" >
.dh-campaign-perfomance-view {
  .dh-chart {
    width: 100%;
    min-width: 350px;
    margin-bottom: 15px;

    .c3-line {
      stroke-width: 2px;
    }

    .dh-chart-item-wrapper {
      opacity: 0.8;
      margin-top: 22px;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #e8ecef;

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

  .dh-tab-pane {
    .dh-statistic-thread-controls {
      padding: 30px 0 10px;
      display: flex;
      justify-content: space-between;
    }

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

  path.domain {
    stroke: #778ca2;
  }

  g.c3-axis.c3-axis-x {
    fill: #778ca2;
  }
  .tick line {
    stroke: #98a9bc;
  }
  .c3-line {
    stroke-width: 3px;
  }
}
</style>
