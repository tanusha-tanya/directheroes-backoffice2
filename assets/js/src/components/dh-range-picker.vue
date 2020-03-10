<template>
  <div class="dh-controls">
    <div class="dh-control">
      <div class="dh-control-title">Dates</div>
    </div>
    <el-date-picker
      v-model="dateAt"
      size="small"
      type="daterange"
      start-placeholder="date since"
      end-placeholder="date till"
      class="dh-chart-time-picker"
      range-separator="to"
      :picker-options="pickerOptions"
    ></el-date-picker>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    /**
     * * Default interval
     */
    fromto: Array,

    /**
     * * Calc granularity by difference date-times
     * * If set as true then second argument in onChange function will be granularity value
     */
    granularity: false
  },

  /**
   * * Component state
   */
  data: () => {
    const prefix = "Last";
    const dayms = 3600 * 1000 * 24;
    const onShortcutSelect = (picker, days) => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - `${days * dayms}`);
      picker.$emit("pick", [start, end]);
    };
    const shortcutsItems = [
      { text: `${prefix} week`, interval: 7 },
      { text: `${prefix} 2 week`, interval: 14 },
      { text: `${prefix} month`, interval: 30 },
      { text: `${prefix} 3 month`, interval: 90 },
      { text: `${prefix} year`, interval: 365 }
    ];

    return {
      interval: [],
      changeEvent: "change",
      options: {
        month: 2592000,
        day: 86400,
        hour: 3600
      },
      pickerOptions: {
        shortcuts: shortcutsItems.map(c => {
          return {
            text: c.text,
            onClick: picker => onShortcutSelect(picker, c.interval)
          };
        })
      }
    };
  },

  methods: {
    getGranularity(range) {
      const [begin, end] = range;
      const diff = moment(end).diff(begin);
      const duration = Math.floor(moment.duration(diff).asDays() + 1 / 30);
      const monthCount = Math.floor(duration / 30);

      let granularity = this.options.hour;
      if (monthCount) {
        granularity = monthCount > 2 ? this.options.month : this.options.day;
      }
      if (duration >= 7) {
        granularity = this.options.day;
      }

      return granularity;
    }
  },

  computed: {
    dateAt: {
      get() {
        if (!this.interval.length) {
          return this.fromto;
        }

        return this.interval;
      },
      set(value) {
        if (!value) {
          value = this.fromto;
        }

        let [begin, end] = value;
        if (begin.getTime() === end.getTime()) {
          begin = begin - 1;
        }

        let { changeEvent, granularity, getGranularity } = this;
        this.interval = [begin, end];
        if (granularity) {
          this.$emit(changeEvent, this.interval, getGranularity(this.interval));
        } else {
          this.$emit(changeEvent, this.interval);
        }
      }
    }
  }
};
</script>