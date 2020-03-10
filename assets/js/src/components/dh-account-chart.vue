<template>
  <div class="dh-account-chart">
    <dhChart ref="chart" :options="options" :columns="columns" />
    <loader class="dh-chart-loader" v-if="!columns && !refreshable" />
    <div class="dh-refresh-container" v-if="refreshable">
      <refresh class="dh-refresh" @click="$emit('refresh')" />
      <span>There is no data available</span>
      <span>{{ tryAgain }}</span>
    </div>
  </div>
</template>

<script>
import dhChart from "./dh-chart";
import loader from "./dh-loader";
import refresh from "../assets/refresh.svg";

export default {
  props: ["options", "columns", "refreshable", "syncTimeEnd"],

  components: {
    dhChart,
    refresh,
    loader
  },

  computed: {
    tryAgain() {
      return `Try again in ${this.syncTimeEnd || 5} seconds`;
    }
  }
};
</script>

<style lang="scss">
.dh-account-chart {
  position: relative;

  .dh-refresh-container {
    width: inherit;
    width: inherit;
    position: absolute;
    top: 10px;
    right: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      font-size: 18px;
    }
  }

  .dh-refresh {
    width: 64px;
    max-height: 64px;
    color: $elementsColor;
    cursor: pointer;

    &:hover {
      color: $elementActiveColor;
    }
  }

  .dh-chart-loader {
    position: absolute;
    height: inherit;
    width: inherit;
    right: 55%;
    top: 0%;
  }
}
</style>