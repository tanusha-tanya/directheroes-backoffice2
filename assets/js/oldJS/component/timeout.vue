<template>
  <div class="timeout">
    <input-autosize :value="timeValue" @input.native="checkTime" only-numbers></input-autosize>
    <el-select class="hidden-select" v-model="timeType" size="mini" popper-class="small-dropdown">
      <el-option label="hours" value="hours"></el-option>
      <el-option label="minutes" value="minutes"></el-option>
      <el-option label="seconds" value="seconds"></el-option>
    </el-select>
  </div>
</template>

<script>
import Vue from 'vue';
import utils from '../utils';
import inputAutosize from './inputAutosize';

export default {
  data() {
    return {
      timeValue: 1
    }
  },

  props:['element'],

  components: {
    inputAutosize
  },

  computed: {
    actionElement() {
      const { elements } = this.element;

      return elements.find(element => element.type === 'action')
    },

    ruleElement() {
      const { elements } = this.element;

      return elements.find(element => element.type === 'rule')
    },

    seconds: {
      get() {
        const { ruleElement } = this;

        return ruleElement.condition.value
      },
      set(value) {
        const { actionElement, ruleElement } = this;

        if (actionElement) {
          actionElement.body.delta = value;
        }

        ruleElement.condition.value = value;
      }
    },

    timeType: {
      get() {
        const { seconds } = this

        return utils.secondsToTimeType(seconds)
      },

      set(value) {
        const { timeValue } = this;

        this.timeValue = Math.min(timeValue || 0, timeValue === 'hours' ? 72 : 59);

        this.seconds = this.timeValue * utils.types[value];
      }
    },
  },

  methods: {
    calculate() {
      const { seconds } = this;
      const { timeType } = this;

      return utils.timeFromSeconds(seconds, timeType)
    },

    checkTime(event) {
      const { timeType } = this;
      const { value } = event.target;

      Vue.set(this, 'timeValue', Math.max(Math.min(value || 0, timeType === 'hours' ? 72 : 59), 1))
    }
  },

  created() {
    this.timeValue = this.calculate();
  },

  watch: {
    seconds() {
      this.$nextTick(() => {
        this.timeValue = this.calculate();
      })
    },
    timeValue(value) {
      const { timeType } = this;

      this.seconds = Math.min(259200, value * utils.types[timeType]) || 1;
    }
  }
}
</script>

<style lang="scss">
  .timeout {
    display: inline-block;

    .input-autosize {
      margin: 0 2px;
    }
  }
</style>