<template>
  <div class="basic-delay">
    <el-input-number :min="timeType != 'seconds' ? 1 : 0" size="mini" controls-position="right" v-model="timeValue" @change="setSeconds"></el-input-number>
    <el-select v-model="timeType" size="mini">
      <el-option label="Weeks" value="weeks"></el-option>
      <el-option label="Days" value="days"></el-option>
      <el-option label="Hours" value="hours"></el-option>
      <el-option label="Minutes" value="minutes"></el-option>
      <el-option label="Seconds" value="seconds"></el-option>
    </el-select>
  </div>
</template>
<script>
import Vue from 'vue'

const types = {
  weeks: 604800,
  days: 86400,
  hours: 3600,
  minutes: 60,
  seconds: 1
}

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

        if ( seconds / 604800 | 0 ) {
          return 'weeks'
        } else if ( seconds % 604800 / 86400 | 0 ) {
          return 'days'
        } else if ( seconds % 86400 / 3600 | 0 ) {
          return 'hours'
        } else if ( seconds % 3600 / 60 | 0 ) {
          return 'minutes'
        } else  {
          return 'seconds'
        }
      },

      set(value) {
        this.element.value.seconds = 1 * types[value];
      }
    },
  },

  methods: {
    calculate() {
      const { seconds } = this.element.value
      const { timeType } = this;

      switch (timeType) {
        case 'weeks':
          return ( seconds / 604800 | 0 ) || 1
          break;
        case 'days':
          return ( seconds % 604800 / 86400 | 0 ) || 1
          break;
        case 'hours':
          return ( seconds % 86400 / 3600 | 0 ) || 1
          break;
        case 'minutes':
          return ( seconds % 3600 / 60 | 0 ) || 1
          break;
        default:
          return seconds
          break;
      }
    },

    setSeconds(value) {
      const { element, timeType } = this;
      
      element.value.seconds = value * types[timeType];
    }
  },

  created() {
    this.timeValue = this.calculate();
  },

  watch: {
    'element.value.seconds'() {
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
