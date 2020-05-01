<template>
  <div class="dh-settings-form dh-profile-general">
    <div class="dh-settings-title">General information</div>
    <div class="dh-settings-form-row">
      <label class="dh-label">
        <span>First name</span>
        <input type="text" class="dh-input" :value="dhAccount.firstName" readonly />
      </label>
      <label class="dh-label">
        <span>Last name</span>
        <input type="text" class="dh-input" :value="dhAccount.lastName" readonly />
      </label>
    </div>
    <div class="dh-settings-form-row dh-blacklist-row" v-if="blackListSetting">
      <label class="dh-label">
        <span>Account blacklist</span>
        <el-select
          class="dh-blacklist-select"
          :class="{ 'dh-loading': loading }"
          v-model="blackListSetting.value"
          placeholder="Print username and press 'Enter'"
          popper-class="dh-disabled-select-list"
          multiple
          filterable
          default-first-option
          :allow-create="true"
          >
        </el-select>
      </label>
      <div class="dh-notification dh-notification-error" v-if="error">
        <warning />
        {{error}}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import warning from '../assets/warning.svg'

export default {
  data() {
    return {
      loading: false,
      error: null
    };
  },

  components: {
    warning
  },

  computed: {
    blackListSetting() {
      const { settings } = this.dhAccount;
      const blackListSetting = settings.find(setting => setting.type === 1);

      if (!blackListSetting) {
        const newSetting = {
          type: 1,
          value: []
        }

        settings.push(newSetting);

        return newSetting
      }

      return settings.find(setting => setting.type === 1);
    }
  },

  methods: {
    saveBlacklist() {
      const { dhAccount, blackListSetting, saveBlacklist } = this;

      this.loading = true;
      this.error = null;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/cancel`,
        method: "post",
        data: {
          userId: dhAccount.id,
          type: 1,
          value: blackListSetting.value
        }
      })
        .catch(({ response }) => {
          this.error = "Error happened during blacklist saving";

          setTimeout(saveBlacklist, 10000);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },

  watch: {
    'blackListSetting.value'() {
      const { saveBlacklist } = this;

      saveBlacklist();
    }
  }
};
</script>

<style lang="scss">
.dh-profile-general {
  overflow: auto;

  .dh-blacklist-row {
    display: block;
  }

  .dh-blacklist-select {
    width: 100%;
    position: relative;

    &.dh-loading {
      &:after {
        content: '';
        display: block;
        position: absolute;
        top: calc(50% - 10px);
        right: 10px;
        width: 15px;
        height: 15px;
        border-radius: 15px;
        border: 2px solid $elementActiveColor;
        border-bottom-color: transparent;
        animation: rotation .8s infinite linear;
        z-index: 4;
      }
    }

    .el-input__suffix {
      display: none;
    }

    .el-tag, .el-tag span {
      display: inline;
    }

    .el-input.is-focus .el-input__inner {
      border-color: #E8ECEF;
    }
  }
}

.dh-disabled-select-list {
  display: none;
}
</style>
