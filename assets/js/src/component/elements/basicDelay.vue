<template>
  <div class="basic-delay">
    <el-input-number :min="timeType != 'seconds' ? 1 : 0" size="mini" controls-position="right" v-model="timeValue" @change="setSeconds"></el-input-number>
    <el-select v-model="timeType" size="mini">
      <!-- <el-option label="Weeks" value="weeks"></el-option>
      <el-option label="Days" value="days"></el-option> -->
      <el-option label="Hours" value="hours"></el-option>
      <el-option label="Minutes" value="minutes"></el-option>
      <el-option label="Seconds" value="seconds"></el-option>
    </el-select>
  </div>
</template>
<script>
import Vue from 'vue'
import utils from '../../utils'

export default {
  data() {
    return {
      timeValue: 1
    }
  },

  props:['element'],

  computed: {
    timeType: {
      get() {
        const { seconds } = this.element.value

        return utils.secondsToTimeType(seconds)
      },

      set(value) {
        this.element.value.seconds = 1 * utils.types[value];
      }
    },
  },

  methods: {
    calculate() {
      const { seconds } = this.element.value
      const { timeType } = this;

      return utils.timeFromSeconds(seconds, timeType)
    },

    setSeconds(value) {
      const { element, timeType } = this;

      element.value.seconds = Math.min(259200, value * utils.types[timeType]);

      this.$nextTick(() => {
        this.timeValue = this.calculate();
      })
    }
  },

  created() {
    this.timeValue = this.calculate();
  },

  watch: {
    'element.value.seconds'(value) {
      this.$nextTick(() => {
        this.timeValue = this.calculate();
      })
    }
  }
}
</script>
<style lang="scss">
  .basic-delay {
    display: flex;
    align-items: center;
    padding: 20px;

    .el-input-number {
      margin-right: 16px;
    }
  }
</style>
