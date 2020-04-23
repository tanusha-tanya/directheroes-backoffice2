<template>
  <div class="dh-view dh-affiliate-view">
    <dh-header title="Partner Program"></dh-header>
    <div class="dh-view-content">
      <dh-affiliate :affiliateInfo="affiliateInfo" />
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import dhHeader from "../components/dh-header";
import dhFooter from "../components/dh-footer";
import loader from "../components/dh-loader";
import dhAffiliate from "../components/dh-affiliate";

export default {
  data() {
    return {
      affiliateInfo: null,
      activeTab: "analytics"
    };
  },

  components: {
    dhHeader,
    dhFooter,
    loader,
    dhAffiliate
  },

  created() {
    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/affiliate/report`,
      method: "post"
    }).then(({ data }) => {
      this.affiliateInfo = data.response.body;
    });
  }
};
</script>

<style lang="scss">
.dh-affiliate-view {
  .dh-view-content {
    display: flex;
    flex-direction: column;
  }

  .dh-loader {
    flex-grow: 1;
  }

  .dh-affiliate {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .dh-affiliate-row {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &:last-child {
      flex-grow: 1;
    }
  }

  .dh-affiliate-column {
    background-color: $sectionBG;
    border-radius: 4px;
    padding: 20px;
    flex-grow: 1;
    box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);

    &.dh-affiliate-column--hidden {
      background-color: unset;
      box-shadow: unset;
      border-radius: unset;
    }

    &:not(:last-child) {
      margin-right: 20px;
    }

    .dh-input {
      padding: 5px;
      margin: 10px 0;
      font-weight: bold;
    }

    .dh-button {
      margin-left: 10px;
    }
  }

  .dh-affiliate-link {
    color: $elementActiveColor;
  }

  .dh-affiliate-info {
    .dh-affiliate-column {
      text-align: center;
    }
  }

  .dh-referral-user-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #f2f4f6;

    & > * {
      width: 25%;
      text-align: center;
    }
  }

  .dh-affiliate-column-title {
    font-weight: 500;
    margin-bottom: 3px;
  }

  .dh-link-button {
    padding: 5px 7px !important;
  }

  .dh-affiliate-template {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;
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
    outline: none;
    border: 1px solid $elementActiveColor;
    text-decoration: none;
    text-align: center;
    margin-top: 20px;

    &:hover {
      background-color: #9248e5;
    }
  }
}
</style>