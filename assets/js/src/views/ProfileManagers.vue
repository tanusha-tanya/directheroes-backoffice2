<template>
  <div class="dh-settings-form dh-profile-general">
    <div class="dh-settings-title">
      Profile managers
    </div>
    <div class="dh-settings-form-row">
      <button class="dh-button" @click="creating = true">Create manager</button>
    </div>
    <confirm-dialog
            :title="'Manager delete'"
            :message="'Confirm delete manager ' + managerToDelete.username"
            :value="true"
            v-if="managerToDelete.username"
            @success="deleteManager"
            @cancel="cancelDelete"/>
    <loader v-if="loading"/>
    <div v-else>
      <add-manager-popup @creating="setCreating" @created="getManagers" v-if="creating" :created="managerCreated"></add-manager-popup>
      <div class="dh-settings-form-row" v-for="(manager, key) in managers" :key=key>
        <div class="dh-label">
          <span>Email</span>
          {{ manager.username }}
        </div>
        <button class="dh-button" @click="managerToDelete = manager" :disabled="deleting">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import loader from '../components/dh-loader'
import addManagerPopup from '../components/dh-add-manager'
import confirmDialog from '../components/dh-confirm-dialog'

export default {
  data() {
    return {
      managerToDelete: {},
      managers: [],
      loading: true,
      creating: false,
      added: false,
      deleting: false
    }
  },

  components: {
    loader,
    addManagerPopup,
    confirmDialog
  },

  methods: {
    setCreating(creating) {
      this.creating = creating
    },
    getManagers() {
      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/child-user`
      }).then(({data}) => {
        this.managers = data.response.body.list;
        this.loading = false;
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
    },
    managerCreated() {
      this.getManagers()
    }
  },
  created() {
    this.getManagers()
  }
}
</script>

<style lang="scss">
.dh-profile-general {
  .dh-settings-form-buttons {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }
}
</style>
