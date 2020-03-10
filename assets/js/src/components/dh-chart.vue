<template>
  <div class="dh-chart-container">
    <div :class="{ 'dh-chart-active': columns && columns.length, 'dh-chart-wrapper': true }">
      <slot name="chart-top"></slot>
      <vue-c3 class="dh-chart" :handler="handler"></vue-c3>
      <slot name="chart-bottom"></slot>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueC3 from "vue-c3";
import moment from "moment";
import deepMerge from "../../oldJS/utils/deepMerge";

export default {
  components: {
    VueC3
  },

  props: ["options", "columns"],

  data: () => ({
    handler: new Vue(),
    initialized: false
  }),

  computed: {
    /**
     * * Default chart options
     */
    defaultOptions() {
      const { columns } = this;

      return {
        padding: {
          left: 15,
          right: 15
        },
        data: {
          x: "x",
          xFormat: "%Y-%m-%d",
          type: "line",
          labels: false,
          columns: columns
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
                max: 10
              },
              format: function(e) {
                return moment(e).format("YYYY-MM-DD");
              },
              fit: true,
              multiline: true
            }
          }
        },
        legend: {
          hide: false
        },
        transition: {
          duration: 1000
        }
      };
    }
  },

  watch: {
    columns: function(col, oldCol) {
      if (!col) return;

      const { handler, initGraph, initialized } = this;
      if (!initialized) {
        initGraph();
        return;
      }

      this.$nextTick(() => {
        handler.$emit("dispatch", chart => {
          chart.load({
            columns: col
          });

          chart.flush();
        });
      });
    }
  },

  mounted() {
    const { columns, initGraph } = this;
    if (columns && columns.length) {
      initGraph();
    }
  },

  methods: {
    /**
     * * Resize a chart
     * * * example:
     * * * * Should be call after change tab-pane
     */
    resize() {
      this.$nextTick(() => {
        this.handler.$emit("dispatch", chart => {
          chart.resize();
        });
      });
    },

    /**
     * * Force rerender
     */
    flush() {
      this.$nextTick(() => {
        this.handler.$emit("dispatch", chart => {
          chart.flush();
        });
      });
    },

    /**
     * * Initialization
     */
    initGraph() {
      const { handler, defaultOptions, options } = this;
      handler.$emit(
        "init",
        options ? deepMerge(defaultOptions, options) : defaultOptions
      );
      this.initialized = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.dh-chart-container {
  position: relative;

  .dh-chart-wrapper {
    margin-top: 22px;
    background-color: $sectionBG;
    border-radius: 4px;
    opacity: 0.4;
    border: 1px solid $borderColor;

    &.dh-chart-active {
      opacity: 1;
    }
  }

  .dh-chart {
    width: 100%;
    height: 160px;

    path.domain {
      stroke: #778ca2;
    }

    g.c3-axis.c3-axis-x {
      fill: #283747;
    }
  }
}
</style>