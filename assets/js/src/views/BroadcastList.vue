 <template>
<div class="dh-view dh-broadcast-view">
  <dh-header title="Broadcast"></dh-header>
  <div class="dh-view-content">
    <template v-if="currentAccountData">
      <div class="dh-campaigns-controls">
        <span></span>
        <tariff-wrapper class="dh-new-item-button" @click.native="isAddBroadcast = true" :is-enabled="limitIsAvailable">
          <plus/><span>New broadcast</span>
        </tariff-wrapper>
      </div>
      <div class="dh-list" v-if="broadcasts && broadcasts.length">
        <router-link :to="{ name: 'accountBroadcast', params:{ campaignId: campaign.id }}" class="dh-list-item" v-for="campaign in broadcasts" :key="campaign.id">
          <div class="dh-campaign-name">{{campaign.name}}</div>
          <el-popover placement="bottom" trigger="click">
            <div class="dh-options">
              <div class="dh-option" @click="broadcastToDelete = campaign">
                <trash /> Delete
              </div>
            </div>
            <div class="dh-campaign-actions" slot="reference" @click="blockEvent">
              <ellipsis />
            </div>
          </el-popover>
        </router-link>
      </div>
      <div class="dh-info" v-else>
        <nocampaign/>
        <span>
          <strong>No broadcasts found?</strong>
          Try creating a new broadcast from scratch or<br>
          view one of our tutorials.
        </span>
      </div>
      <dh-confirm-dialog
        v-model="isDeleteCampaign"
        title="Delete campaign"
        message="Are you sure you want to delete campaign?"
        @success="deleteCampaign">
      </dh-confirm-dialog>
      <el-dialog
        :visible.sync="isAddBroadcast"
        title="Create New Broadcast"
        custom-class="dh-campaign-add-dialog"
        append-to-body
        width="554px"
        >
        <div class="dh-campaign-add-input">
          <input class="dh-input" v-model="newBroadcastName" placeholder="Enter Broadcast name">
        </div>
        <template slot="footer">
          <button class="dh-button" @click="createBroadcast" :disabled="!newBroadcastName">Create</button>
          <button class="dh-button dh-reset-button" @click="isAddBroadcast = false">Close</button>
        </template>
      </el-dialog>
    </template>
    <loader v-else/>
  </div>
  <dh-footer></dh-footer>
</div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import plus from '../assets/plus.svg'
import dhConfirmDialog from '../components/dh-confirm-dialog'
import nocampaign from '../assets/nocampaign.svg'
import ellipsis from '../assets/ellipsis.svg'
import trash from '../assets/trash.svg'
import calendar from '../assets/schedule.svg'
import loader from '../components/dh-loader'
import TariffWrapper from '../components/dh-tariff-wrapper'
import axios from 'axios'

import ObjectId from '../../oldJS/utils/ObjectId'
import triangle from '../../oldJS/assets/triangle.svg'

export default {
  data() {
    return {
      broadcastToDelete: false,
      isAddBroadcast: false,
      newBroadcastName: ''
    }
  },

  components: {
    dhHeader,
    dhFooter,
    ellipsis,
    plus,
    trash,
    calendar,
    dhConfirmDialog,
    loader,
    nocampaign,
    triangle,
    TariffWrapper
  },

  computed: {
    broadcasts() {
      const { currentAccountData } = this.$store.state;
      let campaigns = null;

      if (!currentAccountData) return null;

      campaigns = currentAccountData.campaigns.filter(campaign => campaign.type == 'broadcast' && !campaign.isArchived);

      return campaigns.reverse();
    },

    currentAccountData() {
      const { currentAccountData } = this.$store.state;

      return currentAccountData
    },

    isDeleteCampaign: {
      get() {
        const { broadcastToDelete } = this;

        return Boolean(broadcastToDelete)
      },
      set(value) {
        this.broadcastToDelete = value;
      }
    },

    limitIsAvailable() {
      const { getTariffParameter } = this;
      const broadcastLimitTariff = getTariffParameter('broadcast_runtime_limit');

      return broadcastLimitTariff && broadcastLimitTariff.remain
    }
  },

  methods: {
    createBroadcast() {
      const { getTariffParameter } = this;
      const broadcastLimitTariff = getTariffParameter('broadcast_runtime_limit');
      const { newBroadcastName, $store, currentAccountData, updatePermissions } = this;
      const { currentAccount } = $store.state;

      broadcastLimitTariff.remain--

      $store.commit('set', { path: 'onSaveHandler', value: updatePermissions });
      $store.commit('set', { path: 'saveTimeout', value: 0 });

      const newBroadcast = {
        id: (new ObjectId).toString(),
        name: newBroadcastName,
        igAccountId: currentAccount.id,
        createdAt: Date.now(),
        type: 'broadcast',
        isEnabled: true,
        isActive: false,
        isIncomplete: true,
        isArchived: false,
        settings: {
          categoryList: []
        },
        status: {
          statusText: 'draft'
        },
        steps: [],
      }

      currentAccountData.campaigns.push(newBroadcast);

      this.isAddBroadcast = false;
      this.newBroadcastName = '';

      this.$router.push({ name: 'accountBroadcast', params: { campaignId: newBroadcast.id, accountId: currentAccount.id } })
    },

    deleteCampaign() {
      const { broadcastToDelete, updatePermissions, $store } = this;

      $store.commit('set', { path: 'onSaveHandler', value: updatePermissions });
      $store.commit('set', { path: 'saveTimeout', value: 0 });

      broadcastToDelete.isArchived = true;
      this.broadcastToDelete = false;
    },

    updatePermissions() {
      const { currentAccount } = this;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/${ currentAccount.id }/subscription-capabilities`,
      }).then(({ data }) => {
        currentAccount.subscriptionCapabilities = data.response.body;
      })
    }
  },

  watch: {
    broadcasts() {
      const { updatePermissions, $store } = this;
      const { onSaveHandler } = $store.state;

      if (onSaveHandler === updatePermissions) return;

      updatePermissions();
    }
  }
}
</script>

<style lang="scss">
.dh-broadcast-view {
  .dh-loader {
    min-height: 50vh;
  }

  .dh-list-item {
    &:hover {
      .dh-campaign-name {
        color: $elementActiveColor;
      }
    }
  }

  .dh-info {
    margin-top: 10px;

    strong {
      color: $mainTextColor;
      font-weight: normal;
      display: block;
      margin-bottom: 10px;
    }
  }

  .dh-campaign-name {
    flex-grow: 1;
  }
}
</style>