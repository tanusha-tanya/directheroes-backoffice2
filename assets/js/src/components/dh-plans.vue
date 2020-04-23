<template>
  <div class="dh-plans">
    <div class="dh-plan-tabs">
      <div class="dh-plan-tab" :class="{'dh-plan-tab--active': selectedTab === plan.code, 'dh-plan-tab--selected': plan === selectedPlan}" v-for="plan in plans" :key="plan.code" @click="scrollPlan(plan.code)">{{plan.name}}</div>
    </div>
    <div class="dh-plan-list" ref="scrollElement">
      <div
        class="dh-plan-item"
        :class="{'dh-selected-plan': plan === selectedPlan, 'dh-plan-contact-us': plan.contactUs, 'dh-plan-recommended': plan.code === recommendedPlan }"
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
          <div class="dh-plan-price" v-else>
            <div class="dh-plan-old-price" v-if="plan.oldPrice">${{plan.oldPrice}}</div>
            <div class="dh-gradient-text">${{plan.price}} / month</div>
          </div>
        </div>
        <div class="dh-plan-parameters" >
          <div class="dh-plan-parameter-item" v-for="parameter in plan.parameters" :key="parameter.code">
            <div class="dh-plan-parameter-name">
              {{parameter.name}}
              <!-- <span class="dh-parameter-extension" v-if="quotaExtensions[parameter.code]">
                {{''.padStart(quotaExtensions[parameter.code].stars, '*')}}
                <div class="dh-parameter-tooltip">{{`${''.padStart(quotaExtensions[parameter.code].stars, '*')} ${quotaExtensions[parameter.code].text}`}}</div>
              </span> -->
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
    <div class="dh-plan-quotas-description">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0.25C8.23438 0.25 6.59375 0.695312 5.07812 1.58594C3.60938 2.44531 2.44531 3.60938 1.58594 5.07812C0.695312 6.59375 0.25 8.23438 0.25 10C0.25 11.7656 0.695312 13.4062 1.58594 14.9219C2.44531 16.3906 3.60938 17.5547 5.07812 18.4141C6.59375 19.3047 8.23438 19.75 10 19.75C11.7656 19.75 13.4062 19.3047 14.9219 18.4141C16.3906 17.5547 17.5547 16.3906 18.4141 14.9219C19.3047 13.4062 19.75 11.7656 19.75 10C19.75 8.23438 19.3047 6.59375 18.4141 5.07812C17.5547 3.60938 16.3906 2.44531 14.9219 1.58594C13.4062 0.695312 11.7656 0.25 10 0.25ZM10 1.75C11.5 1.75 12.8906 2.125 14.1719 2.875C15.4062 3.60938 16.3906 4.59375 17.125 5.82812C17.875 7.10938 18.25 8.5 18.25 10C18.25 11.5 17.875 12.8906 17.125 14.1719C16.3906 15.4062 15.4062 16.3906 14.1719 17.125C12.8906 17.875 11.5 18.25 10 18.25C8.5 18.25 7.10938 17.875 5.82812 17.125C4.59375 16.3906 3.60938 15.4062 2.875 14.1719C2.125 12.8906 1.75 11.5 1.75 10C1.75 8.5 2.125 7.10938 2.875 5.82812C3.60938 4.59375 4.59375 3.60938 5.82812 2.875C7.10938 2.125 8.5 1.75 10 1.75ZM9.25 5.5V7H10.75V5.5H9.25ZM9.25 8.5V14.5H10.75V8.5H9.25Z" fill="#4D7CFE"/>
      </svg>
      <div class="dh-plan-quotas-item" v-for="(quota, code) in quotaExtensions" :key="code">
        <span class="dh-parameter-extension">
          {{''.padStart(quota.stars, '*')}}
        </span>
        {{quota.text}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const { selectedPlan, plans, recommendedPlan } = this;
    const currentPlan = selectedPlan || plans[0];

    return {
      selectedTab: recommendedPlan || currentPlan.code
    }
  },

  props: ['plans', 'selectedPlan', 'actionText', 'recommendedPlan'],

  computed: {
    quotaExtensions() {
      const { plans } = this;
      const quotas = {}

      plans.forEach( plan => plan.parameters.forEach(parameter => {
          if (quotas.hasOwnProperty(parameter.code) || !parameter.quotaExtensionType || parameter.quotaExtensionType !== 'pay_per_unit') return;

          quotas[parameter.code] = {
            stars: Object.keys(quotas).length + 1,
            text: `Per additional ${ parameter.uniteName } — $ ${ parameter.quotaPrice }`
          }
        })
      )

      return quotas
    },
  },

  methods: {
    contactTo() {
      const { contactEmail } = dh;
      let newTab = null;

      if (!contactEmail) return;

      newTab = window.open(`mailto:${ contactEmail }`, '_blank');
      newTab.focus();
    },

    scrollPlan(planCode, noAnimation) {
      const { scrollElement } = this.$refs;
      const [planElement] = this.$refs[planCode];

      if (!planElement || !scrollElement) return;

      this.selectedTab = planCode;

      scrollElement.scrollTo({left: planElement.offsetLeft - 28, behavior: noAnimation ? 'auto' : 'smooth'})
    },
  },

  mounted() {
    const { scrollPlan, selectedTab } = this;

    scrollPlan(selectedTab, true);
  }
}
</script>

<style lang="scss">
.dh-plans {
  text-align: center;

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

      &.dh-plan-recommended {
        border: double 1px transparent;
        background-image: linear-gradient($white, $white), linear-gradient(90deg, #661ACE 60.16%, #2665F9 100%);
        background-origin: border-box;
        background-clip: content-box, border-box;
      }

      // &:not(.dh-plan-recommended):not(.dh-plan-contact-us) {
      //   .dh-plan-name {
      //     color: #98A9BC;

      //     &:after {
      //       content: ' (Unavailable)';
      //     }
      //   }

      //   .dh-plan-price {
      //     border-color: #98A9BC;
      //   }

      //   .dh-gradient-text {
      //     background: none;
      //     -webkit-text-fill-color:#98A9BC;
      //     color: #98A9BC;
      //     text-decoration: line-through;
      //   }
      // }
    }

    .dh-plan-selected__sign {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
    }

    .dh-plan-info {
      padding: 16px 0;
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
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dh-gradient-text {
      background: linear-gradient(90deg, #661ACE 60.16%, #2665F9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: #661ACE;
    }

    .dh-plan-old-price {
      font-size: 18px;
      line-height: 22px;
      text-decoration: line-through;
      background: none;
      color: #98A9BC;
      margin-right: 10px;
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

  .dh-parameter-extension {
    color: #4D7CFE;
    position: relative;
    cursor: default;

    &:hover .dh-parameter-tooltip {
      opacity: 1;
    }
  }

  .dh-parameter-tooltip {
    background-color: #4D7CFE;
    white-space: nowrap;
    left: calc(100% + 12px);
    top: calc(50% - 25px);
    position: absolute;
    padding: 12px 15px;
    color:$white;
    border-radius: 4px;
    z-index: 1;
    opacity: 0;
    transition: opacity .3s ;

    &:before {
      content: '';
      position: absolute;
      border-width: 10px 10px 10px 0;
      border-color: transparent #4D7CFE;
      border-style: solid;
      left: -10px;
      top: calc(50% - 9px);
    }
  }

  .dh-plan-quotas-description {
    display: inline-flex;
    align-items: center;
    padding: 12px;
    margin: 25px auto 0;
    background-color: #F2F4F6;
    border-radius: 4px;
  }

  .dh-plan-quotas-item {
    margin-left: 12px;
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

    .dh-plan-quotas-description {
      flex-direction: column;
      margin-top: 20px;

      .dh-plan-quotas-item {
        margin-left: 0;
        margin-top: 12px;
      }
    }
  }
}
</style>