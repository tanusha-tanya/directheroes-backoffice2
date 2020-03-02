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
    fromto: {
      type: Array,
      default: () => []
    },

    /**
     * * Callback on change date-range
     */
    onChange: {
      type: Function,
      default: null
    },

    /**
     * * Calc granularity by difference date-times
     * * If set as true then second argument in onChange function will be granularity value
     */
    granularity: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    interval: [],
    options: {
      month: 2592000,
      day: 86400,
      hour: 3600
    },
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
          text: "Last 2 week",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
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
    }
  }),

  methods: {
    getGranularity(range) {
      const [begin, end] = range;
      const diff = moment(end).diff(begin);
      const duration = Math.floor(moment.duration(diff).asDays() + 1 / 30);
      let granularity = this.options.month;

      if (duration < 7) {
        granularity = this.options.hour;
      } else if (duration < 30) {
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

        let { onChange, granularity, getGranularity } = this;
        this.interval = [begin, end];
        if (onChange) {
          if (granularity) {
            onChange(this.interval, getGranularity(this.interval));
            return;
          }
          onChange(this.interval);
        }
      }
    }
  }
};
</script>