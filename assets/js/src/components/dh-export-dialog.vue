<template>
   <el-dialog
    :visible.sync="isShow"
    title="Export audience data"
    width="554px"
    append-to-body
    class="dh-export-dialog"
  >
    <div class="dh-export-content">
      <div class="dh-options-title">Campaigns</div>
      <div class="dh-options">
        <div class="dh-option">entered any of</div>
        <div class="dh-select-wrapper">
          <el-select v-model="filters.campaigns.in" multiple placeholder="Select campaign">
            <el-option v-for="campaign in campaignsList" :key="campaign.id" :label="campaign.name" :value="campaign.id"></el-option>
          </el-select>
        </div>
        <div class="dh-option">entered none of</div>
        <div class="dh-select-wrapper">
          <el-select v-model="filters.campaigns.nin" multiple placeholder="Select campaign">
            <el-option v-for="campaign in campaignsList" :key="campaign.id" :label="campaign.name" :value="campaign.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="dh-options-title">Categories</div>
      <div class="dh-options">
        <div class="dh-option">has any of</div>
        <div class="dh-select-wrapper">
          <el-select v-model="filters.categories.in" multiple placeholder="Select category">
            <el-option v-for="category in categoriesList" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </div>
        <div class="dh-option">has none of</div>
        <div class="dh-select-wrapper">
          <el-select v-model="filters.categories.nin" multiple placeholder="Select category">
            <el-option v-for="category in categoriesList" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="dh-options dh-export-subscribers">
        Total subscribers: {{ paging.totalResultCount }}
      </div>
    </div>
    <template slot="footer">
      <button :class="{'dh-button': true, 'dh-loading': loading}" :disabled="loading" @click="getCSV">Export</button>
      <button class="dh-button dh-reset-button" @click="isShow = false" :disabled="loading">Cancel</button>
    </template>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    const { campaigns, categories } = this;

    return {
      filters: {
        subscribed: true,
        usernameQuery: '',
        campaigns,
        categories
      },
      paging: {
        page: 1,
        totalPageCount: 1,
        totalResultCount: '-'
      },

      loading: false
    }
  },
  props: ['value', 'categories', 'campaigns'],

  computed: {
    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    },

    campaignsList() {
      const { currentAccountData } = this.$store.state;

      if (!currentAccountData) return;

      return currentAccountData.campaigns.filter(campaign => !campaign.isArchived)
    },

    categoriesList() {
      const { subscriberCategoryList } = this.currentAccount;

      return subscriberCategoryList;
    },
  },

  methods: {
    getAudience() {
      const { currentAccount, paging, filters } = this;

      if (!currentAccount) return;

      this.loading = true;
      this.threads = null;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ currentAccount.id }/audience`,
        method: 'post',
        data: { paging,  ...filters }
      })
      .then(({ data }) => {
        const { paging } = data.response.body;

        this.loading = false;

        this.paging = paging;
      })
    },

    getCSV() {
      const { currentAccount, paging, filters } = this;

      this.loading = true;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ currentAccount.id }/audience`,
        data: { paging,  ...filters,  contentFormat: 'csv'},
        responseType: 'blob',
        method: 'post'
      }).then(({data}) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', 'audience.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.isShow = false;
      })
    }
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
  .dh-options-title {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 12px;
    margin-bottom: -15px;
  }

  .dh-option {
    color: #98A9BC;
  }

  .dh-export-subscribers {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 12px;
  }

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