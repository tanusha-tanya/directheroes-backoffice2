<template>
  <div class="dh-settings-form dh-profile-general">
    <div class="dh-settings-title">
      Assignment
    </div>
    <div class="dh-settings-controls">
      <div class="dh-new-item-button" @click="isAddManager = true">
        <plus/><span>Add delegate</span>
      </div>
    </div>
    <loader v-if="loading"/>
    <div class="dh-list" v-else-if="managers && managers.length">
      <div class="dh-list-item" v-for="manager in managers" :key="manager.id">
        <div class="dh-manager-item">
          <div class="dh-manager-name">
            <email />
            {{manager.username}}
          </div>
          <button class="dh-button dh-small" @click="managerToManage = manager">
            Delegate
          </button>
          <div class="dh-manager-delete-button" @click="managerToDelete = manager">
            <trash />
          </div>
        </div>
      </div>
    </div>
    <div class="dh-info" v-else>
      <span>
        Click <strong>"Add delegate"</strong> button to add one
      </span>
    </div>
    <el-dialog
      :visible.sync="isAddManager"
      title="Add delegate"
      custom-class="dh-manager-add-dialog"
      append-to-body
      width="554px">
      <div>
        <div class="dh-manager-add-input">
          <input class="dh-input" v-model="newManagerEmail" placeholder="Enter manager email to add">
        </div>
        <div class="dh-dialog-error" v-if="error">
          {{error}}
        </div>
      </div>
      <template slot="footer">
        <button :class="{'dh-button': true, 'dh-loading': isManagerProcess }" :disabled="!newManagerEmail" @click="addManager">Add</button>
        <button class="dh-button dh-reset-button" @click="isAddManager = false">Close</button>
      </template>
    </el-dialog>
    <dh-sharing-ig-wizzard
      v-model="isManagePopup"
      :delegateShare="managerToManage"
    />
    <confirm-dialog
      :title="'Delegate delete'"
      :message="`Confirm delete delegate ${ managerToDelete && managerToDelete.username }`"
      v-model="isMangerDelete"
      @success="deleteManager"
      @cancel="managerToDelete = null"/>
  </div>
</template>

<script>
import axios from 'axios';
import loader from '../components/dh-loader'
import plus from '../assets/plus.svg'
import trash from '../assets/trash.svg'
import email from '../assets/email.svg'
import confirmDialog from '../components/dh-confirm-dialog'
import dhSharingIgWizzard from '../components/dh-sharing-ig-wizzard'

export default {
  data() {
    return {
      newManagerEmail: '',
      error: null,
      managerToDelete: null,
      isAddManager: false,
      isManagerProcess: false,
      managerToManage: null,
      managers: null,
      loading: true,
    }
  },

  components: {
    loader,
    confirmDialog,
    plus,
    trash,
    email,
    dhSharingIgWizzard
  },

  computed: {
    isMangerDelete: {
      get() {
        const { managerToDelete } = this;

        return Boolean(managerToDelete)
      },

      set() {
        this.managerToDelete = null;
      }
    },

    isManagePopup: {
      get() {
        const { managerToManage } = this;

        return Boolean(managerToManage)
      },

      set() {
        this.managerToManage = null;
      }
    }
  },

  methods: {
    addManager() {
      const { newManagerEmail, managers } = this;

      this.error = '';
      this.isManagerProcess = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/delegate`,
        method: 'post',
        data: {
          email: newManagerEmail
        }
      }).then(({ data }) => {
        managers.push(data.response.body.dhAccount)

        this.isAddManager = false;
        this.isManagerProcess = false;
      }).catch((error) => {
        if (error.response && error.response.data.request) {
          this.error = error.response.data.request.statusMessage
        } else {
          this.error = 'Something goes wrong. Please try again later or contact with our support.'
        }

        this.isManagerProcess = false;
      })
    },

    deleteManager() {
      const { managers, managerToDelete } = this;

      axios.delete(`${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/delegate/${managerToDelete.id}`
      ).then(() => {
        managers.splice(managers.indexOf(managerToDelete), 1)

        this.managerToDelete = null
      }).catch(()=>{
        this.managerToDelete = null
      })
    }
  },

  created() {
    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/delegate`
    }).then(({data}) => {
      this.managers = data.response.body.list || [];
      this.loading = false;
    })
  },

  watch: {
    isAddManager() {
      this.newManagerEmail = '';
      this.error = ''
    }
  }
}
</script>

<style lang="scss">
.dh-profile-general {
  .dh-settings-controls {
    display: flex;
    justify-content: flex-end;
  }

  .dh-list-item {
    cursor: default;
  }

  .dh-manager-item {
    display: flex;
    align-items: center;
    width: 100%;

    .dh-manager-name {
      flex-grow: 1;
      display: flex;
      align-items: center;

      svg {
        width: 20px;
        color: #98A9BC;
        margin-right: 15px;
      }
    }

    .dh-button {
      margin-right: 25px;
      cursor: pointer;
    }

    .dh-manager-delete-button {
      color: #98A9BC;
      cursor: pointer;
    }
  }
}

.dh-manager-add-dialog {
  input {
    width: 100%;
  }

  .el-dialog__body {
    min-height: 200px;
  }
}

.dh-manager-accounts-dialog {
  .el-dialog__body {
    max-height: 400px;
    overflow: auto;
  }

  .el-dialog__footer {
    justify-content: flex-end !important;
  }
}
</style>
