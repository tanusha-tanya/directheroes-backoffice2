<template>
  <div class="dh-plan-list">
    <div class="dh-plan-item" v-for="plan in plans" :key="plan.code">
      <div class="dh-plan-info">
        <div class="dh-plan-name">{{plan.name}}</div>
        <div class="dh-plan-price">${{plan.price}} / month</div>
      </div>
      <div class="dh-plan-parameters">
        <div class="dh-plan-parameter-item" v-for="parameter in plan.parameters" :key="parameter.code">
          {{parameter.name}}
          <div class="dh-plan-quote" v-if="parameter.type === 1">
            {{parameter.quotaLimit === -1 ? 'Unlimited' : parameter.quotaLimit}}
          </div>
          <div class="dh-plan-description" v-else-if="parameter.type === 3">
            {{parameter.description}}
          </div>
          <div class="dh-plan-feature" :class="[`dh-plan-${parameter.enabled ? 'enabled' : 'disable'}`]" v-else>
          </div>
        </div>
        <button class="dh-button" @click="$emit('select-plan', plan)">Upgrade</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['plans'],
}
</script>

<style lang="scss">
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
</style>