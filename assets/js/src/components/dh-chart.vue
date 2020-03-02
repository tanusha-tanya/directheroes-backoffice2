<template>
  <div class="dh-chart-container">
    <div v-bind:class="{ 'active': active, 'dh-chart-wrapper': !flat }">
      <slot name="chart-top"></slot>
      <vue-c3 class="dh-chart" :handler="handler"></vue-c3>
      <slot name="chart-bottom"></slot>
    </div>
    <loader class="dh-chart-loader" v-if="!active" />
  </div>
</template>

<script>
import Vue from "vue";
import VueC3 from "vue-c3";
import moment from "moment";
import loader from "./dh-loader";

export default {
  components: {
    VueC3,
    loader
  },

  props: {
    /**
     * * Means that data-chart is ready
     */
    active: {
      type: Boolean,
      default: false
    },

    /**
     * * No box shadow and no background
     */
    flat: {
      type: Boolean,
      default: false
    },

    /**
     * * Data columns of chart
     */
    columns: {
      type: Array,
      default: () => []
    },

    /**
     * * Color patterns
     */
    colors: {
      type: Array,
      default: () => []
    },

    /**
     * * Granularity between date-ranges
     */
    granularity: {
      type: Number
    },

    /**
     * * Multiline xy-mapping
     */
    xsMapping: {
      type: Object
    }
  },

  data: () => ({
    handler: new Vue(),
    initialized: false,
    options: {
      month: 2592000,
      day: 86400,
      hour: 3600
    }
  }),

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
     * * Tick formatting
     */
    tickFormat(e) {
      const { granularity, options } = this;
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
      let { handler, columns, colors, tickFormat, xsMapping } = this;
      let setup = {
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
        color: {
          pattern: colors
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
              format: tickFormat,
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
      if (xsMapping) {
        setup.data.xs = xsMapping;
        delete setup.data.x;
      }
      handler.$emit("init", setup);

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

    &.active {
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

  .dh-chart-loader {
    position: absolute;
    top: 0%;
    height: inherit;
  }
}
</style>