<template>
   <el-dialog
    :visible.sync="isShow"
    title="Export audience data"
    width="554px"
    append-to-body
    class="dh-export-dialog"
  >
    <div class="dh-export-content">
      <div class="dh-options">
        <div class="dh-option">Campaigns entered any of</div>
        <div class="dh-select-wrapper">
          <el-select v-model="filters.campaigns.in" multiple placeholder="Select campaign">
            <el-option v-for="campaign in campaigns" :key="campaign.id" :label="campaign.name" :value="campaign.id"></el-option>
          </el-select>
        </div>
        <div class="dh-option">Campaigns entered none of</div>
        <div class="dh-select-wrapper">
          <el-select v-model="filters.campaigns.nin" multiple placeholder="Select campaign">
            <el-option v-for="campaign in campaigns" :key="campaign.id" :label="campaign.name" :value="campaign.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="dh-options">
        <div class="dh-option">Categories has any of</div>
        <div class="dh-select-wrapper">
          <el-select v-model="filters.categories.in" multiple placeholder="Select category">
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </div>
        <div class="dh-option">Categories has none of</div>
        <div class="dh-select-wrapper">
          <el-select v-model="filters.categories.nin" multiple placeholder="Select category">
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="dh-options">
        Total subscribers: {{ paging.totalResultCount }}
      </div>
    </div>
    <template slot="footer">
      <a :href="csvUri" :class="{'dh-button': true, 'dh-loading': loading}" :disabled="loading" @click="isShow = false">Export</a>
      <button class="dh-button dh-reset-button" @click="isShow = false" :disabled="loading">Cancel</button>
    </template>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      filters: {
        subscribed: true,
        usernameQuery: '',
        campaigns: {
          in: [],
          nin: []
        },
        categories: {
          in: [],
          nin: []
        }
      },
      paging: {
        page: 1,
        totalPageCount: 1,
        totalResultCount: '-'
      },

      loading: false
    }
  },
  props: ['value'],

  computed: {
    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    },

    account() {
      return this.$store.state.currentAccount
    },

    campaigns() {
      const { currentAccountData } = this.$store.state;

      if (!currentAccountData) return;

      return currentAccountData.campaigns.filter(campaign => !campaign.isArchived)
    },

    categories() {
      const { subscriberCategoryList } = this.account;

      return subscriberCategoryList;
    },

    csvUri() {
      const { account, paging, filters } = this;
      const csvURI = axios.getUri({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ account.id }/audience`,
        params: { paging,  ...filters,  contentFormat: 'csv'}
      })

      return csvURI;
    }
  },

  methods: {
    getAudience() {
      const { account, paging, filters } = this;

      if (!account) return;

      this.loading = true;
      this.threads = null;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ account.id }/audience`,
        method: 'post',
        data: { paging,  ...filters }
      })
      .then(({ data }) => {
        const { paging } = data.response.body;

        this.loading = false;

        this.paging = paging;
      })
    },
  },

  watch: {
    'filters.campaigns': {
      handler() {
        const { getAudience } = this;

        clearTimeout(this.applyFilterTimeout);

        this.applyFilterTimeout = setTimeout(getAudience, 2500)
      },
      deep:true
    },

    'filters.categories': {
      handler() {
        const { getAudience } = this;

        clearTimeout(this.applyFilterTimeout);

        this.applyFilterTimeout = setTimeout(getAudience, 2500)
      },
      deep:true
    }
  },

  created() {
    const { getAudience } = this;

    getAudience();
  }
}
</script>

<style lang="scss">
.dh-export-dialog {
  a.dh-button {
  color: $sectionBG;
  background-color: $elementActiveColor;
  height: 44px;
  font-weight: bold;
  min-width: 206px;
  padding: 15px 15px 14px;
  text-transform: uppercase;
  border-radius: 4px;
  text-align: center;
  outline: none;
  text-decoration: none;
  border: 1px solid $elementActiveColor;

  &:hover {
    background-color: #9248e5;
  }

  &.dh-reset-button {
    border: 1px solid $secondBorderColor;
    background-color: $secondBorderColor;
    color: $elementsColor;

    &:hover {
      color: $elementActiveColor;
    }

    &.dh-loading:before {
      border-color: $elementActiveColor;
      border-bottom-color: transparent;
    }
  }

  &.dh-danger-button {
    border-color: $failColor;
    background-color: $failColor;

    &:hover {
      background-color: #e8498c;
    }
  }

  &:disabled {
    opacity: .3;
  }

  &.dh-loading {
    color: transparent;
    position: relative;

    &:before {
      content: '';
      display: block;
      position: absolute;
      top: calc(50% - 10px);
      left: calc(50% - 10px);
      width: 15px;
      height: 15px;
      border-radius: 15px;
      border: 3px solid #FFF;
      border-bottom-color: transparent;
      animation: rotation  .8s infinite linear;
    }
  }

  &.dh-small {
    min-width: auto;
    height: auto;
    padding: 5px 15px;

    &.dh-loading {
      &:before {
        width: 5px;
        height: 5px;
        border-radius: 5px;
        top: calc(50% - 6px);
        left: calc(50% - 6px);
      }
    }
  }
}
}
</style>