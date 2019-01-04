<template>
  <div class="delay-settings-area">
    <div class="delay-settings">
      <font-awesome-icon :icon="['far', 'clock']" />
      Delay - 
      w:
      <input type="number" class="action-weeks" v-model="weeks" min="0"/>
      d:
      <input type="number" class="action-days" v-model="days" min="0" max="6"/>
      h:
      <input type="number" class="action-hours" v-model="hours" min="0" max="23"/>
      m:
      <input type="number" class="action-minutes" v-model="minutes" min="0" max="59"/>
      s:
      <input type="number" class="action-seconds" v-model="seconds" min="0" max="59"/>
    </div>
  </div>
</template>
<script>
export default {
    props: ['delay'],

    computed: {
      weeks: {
        get() {
          return this.delay / 604800 | 0
        },
        set(value) {
          this.calculate('weeks', value)
        }
      },

      days: {
        get() {
          return this.delay % 604800 / 86400 | 0
        },
        set(value) {
          this.calculate('days', value)
        }
      },

      hours: {
        get() {
          return this.delay % 86400 / 3600 | 0
        },
        set(value) {
          this.calculate('hours', value)
        }
      },

      minutes: {
        get() {
          return this.delay % 3600 / 60 | 0
        },
        set(value) {
          this.calculate('minutes', value)
        }
      },

      seconds: {
        get() {
          return this.delay % 60
        },
        set(value) {
          this.calculate('seconds', value)
        }
      }
    },

    methods: {
      calculate(type, value) {
        const types = {
          weeks: 604800,
          days: 86400,
          hours: 3600,
          minutes: 60,
          seconds: 1
        }

        const seconds = Object.keys(types).reduce((seconds, current) => {
          const currentValue = type == current ? value : this[current];

          return seconds + currentValue * types[current];
        }, 0)

        this.$emit('change', seconds);
      }
    }

}
</script>
<style lang="scss">

</style>


