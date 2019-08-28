<template>
  <div class="timeout">
    <input-autosize v-model="timeValue" @input.native="checkTime" only-numbers></input-autosize>
     <el-select v-model="timeType" size="mini" popper-class="timeout-dropdown">
      <el-option label="Hours" value="hours"></el-option>
      <el-option label="Minutes" value="minutes"></el-option>
      <el-option label="Seconds" value="seconds"></el-option>
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
        const { actionElement } = this;

        return actionElement.body.delta
      },
      set(value) {
        const { actionElement, ruleElement } = this;

        actionElement.body.delta = value;
        ruleElement.condition.value = value;
      }
    },

    timeType: {
      get() {
        const { seconds } = this

        return utils.secondsToTimeType(seconds)
      },

      set(value) {
        this.seconds = 1 * utils.types[value];
      }
    },
  },

  methods: {
    calculate() {
      const { seconds } = this;
      const { timeType } = this;

      return utils.timeFromSeconds(seconds, timeType)
    },

    checkTime() {
      this.timeValue = this.calculate();
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

    .el-select {
      .el-input{
        width: auto;
      }

      .el-input__inner {
        font-family: sans-serif;
        border: none;
        background-color: transparent;
        padding: 0;
        width: 53px;
        font-size: 12px;
        color: #2c3e50;
      }

      .el-input__suffix {
        display: none;
      }
    }
  }

  .timeout-dropdown {
    background: #FFFFFF;
    border: 1px solid #CFCFCF;
    box-sizing: border-box;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    margin: -13px 0 0 20px !important;

    .popper__arrow {
      display: none;
    }

    .el-scrollbar__view {
      padding: 0;
    }

    .el-select-dropdown__item, .el-select-dropdown__item.selected {
      font-size: 11px;
      line-height: 17px;
      height: 17px;
      color: #2D2D2D;
      font-weight: normal;
      padding: 0 5px;
      background-color: #FFF;

      &:hover {
        background-color: #ECECEC;
      }
    }
  }



/* Union */

// position: absolute;
// left: 78.33%;
// right: 12.69%;
// top: 74.35%;
// bottom: 17.38%;

// background: #FFFFFF;
// border: 1px solid #CFCFCF;
// box-sizing: border-box;
// box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);


// /* Rectangle */

// position: absolute;
// left: 78.33%;
// right: 12.69%;
// top: 74.35%;
// bottom: 17.38%;

// background: #FFFFFF;
// border: 1px solid #CDCDCD;
// box-sizing: border-box;
// box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
// border-radius: 2px;


// /* Option button block */

// position: absolute;
// left: 78.48%;
// right: 12.85%;
// top: 74.59%;
// bottom: 17.14%;



// /* Rectangle */

// position: absolute;
// left: 78.48%;
// right: 12.85%;
// top: 78.49%;
// bottom: 19.5%;

// background: #F8F8F8;


// /* +  Add New Account */

// position: absolute;
// left: 79.1%;
// right: 12.85%;
// top: 74.59%;
// bottom: 17.14%;

// font-family: Lato;
// font-style: normal;
// font-weight: normal;
// font-size: 11px;
// line-height: 17px;
// /* or 155% */

// color: #2D2D2D;

// border-radius: 30px;

</style>