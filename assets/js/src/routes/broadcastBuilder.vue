<template>
<div class="broadcast-builder">
  <div class="broadcast-builder-controls">
    <span>Broadcast Builder</span>
    <div class="broadcast-builder-divider"></div>
    <div class="broadcast-builder-control gear">
      <img src="../assets/svg/gear.svg"/>
    </div>
  </div>
  <div class="broadcast-builder-area" v-if="currentBroadcast">
    <broadcast-card :broadcast="currentBroadcast"></broadcast-card>
  </div>
  <builder-elements type="broadcast"></builder-elements>
</div>    
</template>
<script>
import builderElements from '../component/builderElements.vue'
import broadcastCard from '../component/builder-cards/broadcastCard.vue'
import debounce from 'lodash/debounce'

export default {
  beforeRouteEnter(to, from, next) {
    next(accountBroadcast => {
      accountBroadcast.setCurrentBroadcast(to);
    })
  },

  beforeRouteUpdate(to, from, next) {
    this.currentBroadcast = null;

    this.setCurrentBroadcast(to);
    next();
  },

  data() {
    return {
      currentBroadcast: null,
    }
  },

  components: {
    builderElements,
    broadcastCard
  },

  methods: {
    setCurrentBroadcast(route) {
      const { broadcastId } = route.params;
      const { broadcastList } = this.$store.state.currentAccount;
      const currentBroadcast = broadcastList.find(broadcast => broadcast.id == broadcastId);
   
      this.currentBroadcast = currentBroadcast;
    },

    saveBroadcast: debounce(function() {
      this.$store.dispatch('saveCampaign', this.currentBroadcast)
        .catch(() => {
          this.$message.error({
            message: 'Could not save data',
            duration: 3000,
            center: true
          })
        });
    }, 3000),
  },

  watch:{
    '$store.state.accounts'() {
      if (this.currentBroadcast) return;

      this.setCurrentBroadcast(this.$route);
    },
    currentBroadcast: {
      handler: function (broadcast, oldBroadcast) {
        if (!oldBroadcast || !broadcast || broadcast.id !== oldBroadcast.id) return;

        this.saveBroadcast();
      },
      deep: true
    },
  }
}
</script>
<style lang="scss">
.broadcast-builder {
  width: 100%;

 .broadcast-builder-controls {
    display: flex;
    padding: 8px 5px 7px 13px;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    color: #A9A9A9;

    span {
      font-size: 24px;
      line-height: 24px;
      flex-grow: 1;
    }

    .broadcast-builder-divider {
      border-left: 1px solid #A9A9A9;
      height: 34px;
      margin-right: 5px;
    }

    .broadcast-builder-control {
      font-size: 18px;

      &.gear {
        padding: 8px;
        cursor: pointer;

        img {
          width: 16px;
        }
      }
    }
  }

}
</style>
