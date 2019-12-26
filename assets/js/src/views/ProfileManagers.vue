<template>
  <div class="dh-settings-form dh-profile-general">
    <div class="dh-settings-title">
      Managers
    </div>
    <div class="dh-settings-controls">
      <div class="dh-new-item-button" @click="isAddManager = true">
        <plus/><span>Add manager</span>
      </div>
    </div>
    <loader v-if="loading"/>
    <div class="dh-list" v-else-if="managers && managers.length">
      <div class="dh-list-item" v-for="manager in managers" :key="manager.id">
        {{manager.username}}
      </div>
    </div>
    <div class="dh-info" v-else>
      <span>
        <strong>No managers found?</strong>
        Click "Add manager" button to add one
      </span>
      <!-- <div class="dh-settings-form">
        <div class="dh-settings-form-row" v-for="(manager, key) in managers" :key=key>
          <div class="dh-label">
            <span>Email</span>
            {{ manager.username }}
          </div>
        </div>
      </div> -->
    </div>
    <el-dialog
      :visible.sync="isAddManager"
      title="Add manager"
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
        <button :class="{'dh-button': true }" :disabled="!newManagerEmail" @click="addManager">Add</button>
        <button class="dh-button dh-reset-button" @click="isAddManager = false">Close</button>
      </template>
    </el-dialog>
    <confirm-dialog
      :title="'Manager delete'"
      :message="`Confirm delete manager ${ managerToDelete && managerToDelete.username }`"
      v-model="isMangerDelete"
      @success="deleteManager"
      @cancel="managerToDelete = null"/>
  </div>
</template>

<script>
import axios from 'axios';
import loader from '../components/dh-loader'
import plus from '../assets/plus.svg'
import confirmDialog from '../components/dh-confirm-dialog'

export default {
  data() {
    return {
      newManagerEmail: '',
      error: null,
      managerToDelete: null,
      isAddManager: false,
      isAddProcess: false,
      managers: null,
      loading: true,
    }
  },

  components: {
    loader,
    confirmDialog,
    plus
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
    }
  },

  methods: {
    addManager() {
      const { newManagerEmail } = this;

      this.error = '';
      this.isAddProcess = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/child-user`,
        method: 'post',
        data: {
          email: newManagerEmail
        }
      }).then(({ data }) => {
        managers.push(data.response.body.dhAccount)

        this.isAddProcess = false;
        this.isAddManager = false;
      }).catch((error) => {
        if (error.response && error.response.data.request) {
          this.error = error.response.data.request.statusMessage
        } else {
          this.error = 'Something goes wrong. Please try again later or contact with our support.'
        }

        this.isAddProcess = false;
      })
    },

    deleteManager() {
      this.deleting = true
      axios.delete(`${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/child-user/${this.managerToDelete.id}`
      ).then(() => {
        this.getManagers()
        this.deleting = false
      }).catch(()=>{
        this.deleting = false
      })
      this.cancelDelete()
    },
    cancelDelete() {
      this.managerToDelete = {}
      this.deleting = false
    }
  },

  created() {
    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/child-user`
    }).then(({data}) => {
      this.managers = data.response.body.list;
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
}

.dh-manager-add-dialog {
  input {
    width: 100%;
  }

  .el-dialog__body {
    min-height: 200px;
  }
}
</style>
