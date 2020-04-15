<template>
  <div class="dh-plans">
    <div class="dh-plan-tabs">
      <div class="dh-plan-tab" :class="{'dh-plan-tab--active': selectedTab === plan.code, 'dh-plan-tab--selected': plan === selectedPlan}" v-for="plan in plans" :key="plan.code" @click="scrollPlan(plan.code)">{{plan.name}}</div>
    </div>
    <div class="dh-plan-list">
      <div
        class="dh-plan-item"
        :class="{'dh-selected-plan': plan === selectedPlan, 'dh-plan-contact-us': plan.contactUs }"
        v-for="plan in plans"
        :key="plan.code"
        :ref="plan.code">
        <div class="dh-plan-selected__sign">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 4C0 1.79086 1.79086 0 4 0H60C60 0 58.5 22.5 42 39C25.5 55.5 0 60 0 60V4Z" fill="#6DD230"/>
            <path d="M15 23.6471L21 29L33 15" stroke="white" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="dh-plan-info">
          <div class="dh-plan-name">{{plan.name}}</div>
          <div class="dh-plan-price" v-if="plan.contactUs">Individual</div>
          <div class="dh-plan-price" v-else>${{plan.price}} / month</div>
        </div>
        <div class="dh-plan-parameters" >
          <div class="dh-plan-parameter-item" v-for="parameter in plan.parameters" :key="parameter.code">
            <div class="dh-plan-parameter-name">
              {{parameter.name}}
            </div>
            <div class="dh-plan-quote" v-if="parameter.type === 1">
              {{parameter.quotaLimit === -1 ? 'Unlimited' : parameter.quotaLimit}}
            </div>
            <div class="dh-plan-description" v-else-if="parameter.type === 3">
              {{parameter.description}}
            </div>
            <div class="dh-plan-feature" :class="[`dh-plan-${parameter.enabled ? 'enabled' : 'disable'}`]" v-else>
            </div>
          </div>
          <template v-if="plan.contactUs">
            <dh-button class="dh-button" type="reset" @click="contactTo">Contact Us</dh-button>
          </template>
          <template v-else-if="plan !== selectedPlan">
            <dh-button @click="$emit('select-plan', plan)">{{ actionText || 'Upgrade' }}</dh-button>
          </template>
          <template v-else>
            <dh-button class="dh-button" :disabled="true">Selected plan</dh-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const { selectedPlan, plans } = this;
    const currentPlan = selectedPlan || plans[0];

    return {
      selectedTab: currentPlan.code
    }
  },

  props: ['plans', 'selectedPlan', 'actionText'],

  methods: {
    contactTo() {
      const { contactEmail } = dh;
      let newTab = null;

      if (!contactEmail) return;

      newTab = window.open(`mailto:${ contactEmail }`, '_blank');
      newTab.focus();
    },

    scrollPlan(planCode, noAnimation) {
      const [planElement] = this.$refs[planCode];

      if (!planElement) return;

      this.selectedTab = planCode;

      planElement.scrollIntoView({inline: 'center', behavior: noAnimation ? 'auto' : 'smooth'})
    }
  },

  mounted() {
    const { scrollPlan, selectedTab } = this;

    scrollPlan(selectedTab, true);
  }
}
</script>

<style lang="scss">
.dh-plans {
  .dh-plan-list {
    display: flex;
    width: calc(100% + 20px);
    margin: 0 -10px;

    .dh-plan-item {
      flex-grow: 1;
      flex-shrink: 0;
      margin: 0 10px;
      background: #FFFFFF;
      box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);
      border-radius: 4px;

      &.dh-selected-plan {
        position: relative;
        box-shadow: 0 0 0px 3px #6DD230;

        .dh-plan-selected__sign {
          display: block;
        }
      }

      &.dh-plan-contact-us {
        background-color: #3D40E5;

        .dh-plan-info {
          border-color: rgba($white, .06);
        }

        .dh-plan-name {
          color: $white;
        }

        .dh-plan-price {
          color: $white;
          background: none;
          -webkit-text-fill-color: inherit;
          border-color: $white;
        }

        .dh-plan-parameter-item {
          background-color: transparent;
          color: $white;
          border-color: rgba($white, .06);
        }

        .dh-plan-description, .dh-plan-quote {
          color: $white;
        }
      }
    }

    .dh-plan-selected__sign {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
    }

    .dh-plan-info {
      padding: 16px;
      display: flex;
      align-items: center;
      flex-direction: column;
      border-bottom: 1px solid #E8ECEF;
    }

    .dh-plan-name {
      font-size: 20px;
      line-height: 24px;
      color: #252631;
      margin-bottom: 8px;
    }

    .dh-plan-price {
      border: 1px solid #4D7CFE;
      padding: 5px 15px;
      border-radius: 60px;
      font-size: 26px;
      line-height: 31px;
      background: linear-gradient(90deg, #661ACE 60.16%, #2665F9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: #661ACE;
    }

    .dh-plan-parameters {
      padding: 0 16px;
    }

    .dh-plan-parameter-item {
      color: #778CA2;
      font-size: 14px;
      line-height: 17px;
      padding: 9px 0;
      background-color: #fff;
      border-bottom: 1px solid #F2F4F6;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dh-plan-parameter-name {
      &::first-letter {
        text-transform: uppercase;
      }
    }

    .dh-plan-enabled {
      width: 15px;
      height: 9px;
      border-width: 0 0 1px 1px;
      border-color: #6DD230;
      border-style: solid;
      margin-top: -7px;
      transform: rotate(-45deg);
    }

    .dh-plan-disable {
      width: 18px;
      height: 18px;
      position: relative;

      &:before, &:after {
        content: '';
        position: absolute;
        display: block;
        width: 100%;
        left: 0;
        top: calc(50% - 1px);
        height: 2px;
        background-color: #E8ECEF;
      }

      &:before {
        transform: rotate(-45deg);
      }

      &:after {
        transform: rotate(225deg);
      }
    }

    .dh-button {
      width: 100%;
      margin: 16px 0;
    }

    .dh-plan-quote,
    .dh-plan-description {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-align: right;
      color: #252631;
    }

  }

  .dh-plan-tabs {
    display: none;
    justify-content: space-around;
    margin: 25px 0;
  }

  .dh-plan-tab {
    font-weight: 500;
    padding-bottom: 1px;
    font-size: 14px;
    line-height: 17px;
    text-transform: uppercase;

    &.dh-plan-tab--active {
      color: $elementActiveColor;
      border-bottom: 2px solid $elementActiveColor;

      &.dh-plan-tab--selected {
        border-color: #6DD230;
      }
    }

    &.dh-plan-tab--selected {
      position: relative;
      color: #6DD230;

      &:before {
        content: '';
        display: block;
        position: absolute;
        left: -18px;
        top: 1px;
        width: 13px;
        height: 7px;
        border-width: 0 0 1px 1px;
        border-color: #6DD230;
        border-style: solid;
        transform: rotate(-45deg);
      }
    }
  }

  @include  screen-xs {
    .dh-plan-tabs {
      display: flex;
    }

    .dh-plan-list {
      overflow: hidden;

      .dh-plan-item {
        width: 100%;
      }
    }
  }
}
</style>