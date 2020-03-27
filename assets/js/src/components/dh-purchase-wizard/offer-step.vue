<template>
  <div class="dh-wizard-step dh-offer-step">
    <div class="dh-wizard-step-body">
      <loader v-if="inGetPlans"></loader>
      <div class="dh-plan-list" v-else>
        <div class="dh-plan-item" v-for="plan in planList" :key="plan.code">
          <div class="dh-plan-info">
            <div class="dh-plan-name">{{plan.name}}</div>
            <div class="dh-plan-price">{{plan.price}} $</div>
          </div>
          <div class="dh-plan-parameters">
            <div class="dh-plan-parameter-item" v-for="parameter in plan.parameters" :key="parameter.code">
              {{parameter.name}}
              <div class="dh-plan-quote" v-if="parameter.type === 1">
                {{parameter.quotaLimit === -1 ? '∞' : parameter.quotaLimit}}
              </div>
              <div class="dh-plan-description" v-else-if="parameter.type === 3">
                {{parameter.description}}
              </div>
              <div class="dh-plan-feature" :class="[`dh-plan-${parameter.enabled ? 'enabled' : 'disable'}`]" v-else>
              </div>
            </div>
          </div>
          <button class="dh-button dh-small">Upgrade</button>
        </div>
      </div>
    </div>
    <div class="el-dialog__footer">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import plansMock from '../../temp/plansMock'
import loader from '../dh-loader';

export default {

  data() {
    return {
      planList: null,
      inGetPlans: true,
    }
  },

  components: {
    loader
  },

  created() {
    axios({
      url: `${ dh.apiUrl }/api/1.0.0/plans`,
    }).then(({ data }) => {
      const planCodes = ['basic_v2', 'pro_v2', 'hero_v2'];
      const filteredPlans = plansMock.response.body.data.filter(plan => planCodes.includes(plan.code));

      this.planList = ['basic_v2', 'pro_v2', 'hero_v2'].map(planCode => filteredPlans.find(plan => plan.code === planCode));
      this.inGetPlans = false;
    })
  }
}
</script>

<style lang="scss">
  .dh-offer-step {
    .dh-plan-list {
      display: flex;
      width: calc(100% + 20px);
      margin: 0 -10px;
    }

    .dh-plan-item {
      flex-grow: 1;
      flex-shrink: 0;
      margin: 0 10px;
    }

    .dh-plan-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;
      text-transform: uppercase;
      color: #fff;
      font-size: 12px;
      padding: 5px 10px;
      background-color: #778CA2;
    }

    .dh-plan-price {
      background-color: #fff;
      color: #778CA2;
      padding: 3px 10px;
      border-radius: 10px;
    }

    .dh-plan-parameter-item {
      color: #778CA2;
      font-size: 10px;
      padding: 5px 10px;
      text-transform: uppercase;
      background-color: #fff;
      border-width: 0 1px 1px 1px;
      border-color: #e4edf3;
      border-style: solid;
      font-weight: 500;
      letter-spacing: .3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dh-plan-enabled {
      width: 10px;
      height: 6px;
      border-width: 0 0 2px 2px;
      border-color: #6DD230;
      border-style: solid;
      transform: rotate(-45deg);
    }

    .dh-plan-disable {
      width: 10px;
      height: 10px;
      position: relative;

      &:before, &:after {
        content: '';
        position: absolute;
        display: block;
        width: 100%;
        left: 0;
        top: calc(50% - 1px);
        height: 2px;
        background-color: #fe4d4d;
      }

      &:before {
        transform: rotate(-45deg);
      }

      &:after {
        transform: rotate(225deg);
      }
    }

    .dh-button {
      margin: 5px auto;
      display: block;
      width: 90%;
    }

    .dh-plan-quote,
    .dh-plan-description {
      padding: 2px 5px;
      background-color: #a6b6c7;
      border-radius: 5px;
      color: #fff;
    }
  }
</style>
