<template>
  <div class="dh-settings-form dh-profile-general">
    <div class="dh-settings-title">
      General information
    </div>
    <div class="dh-settings-form-row">
      <label class="dh-label">
        <span>First name</span>
        <input type="text" class="dh-input" :value="dhAccount.firstName" readonly>
      </label>
      <label class="dh-label">
        <span>Last name</span>
        <input type="text" class="dh-input" :value="dhAccount.lastName" readonly>
      </label>
    </div>
    <div class="dh-settings-form-row">
        <label class="dh-label">
            <span>Account blacklist</span>
            <vue-tags-input
              placeholder="Print username"
              v-model="blacklist"
              :tags="accounts"
              @tags-changed="newTags => tags = newTags"
              @before-adding-tag="addAccount"
              @before-deleting-tag="deleteAccount"
            />
        </label>
    </div>
    <div class="dh-notification" v-if="notification">
      {{ notification }}
    </div>
    <div class="dh-spacer"></div>
    <div class="dh-settings-form-footer">
      <button :class="{'dh-button': true, 'dh-loading': loading}" @click="saveBlacklist">
          Update
      </button>
    </div>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import axios from 'axios'

export default {
    data () {
        return {
            loading: false,
            notification: null,
            accounts: [],
            blacklist: ""
        }
    },

    components: {
        VueTagsInput,
    },

    methods: {
        addAccount(obj) {
            this.blacklist = "";
            this.accounts.push({'text': obj.tag.text, "tiClasses":["ti-valid"]});

            obj.addTag();
        },

        deleteAccount(obj) {
            let index = this.accounts.findIndex(x => x.text === obj.tag.text);
            this.accounts.splice(index, 1);
        },

        fillAccountList() {
            let accounts = [];

            this.dhAccount.settings.forEach(function (setting) {
                if (setting.type === 1) {
                    setting.value.forEach(function(account){
                        accounts.push({'text': account, "tiClasses":["ti-valid"]})
                    });
                }
            });

            this.accounts = accounts
        },
        saveBlacklist() {
            this.loading = true;

            let settingValue = [];
            this.accounts.forEach(function(account){
               settingValue.push(account.text)
            });

            axios({
                url: `${ dh.apiUrl }/api/1.0.0/${ this.dhAccount.username }/settings/update`,
                method: 'post',
                data: {
                    userId: this.dhAccount.id,
                    type: 1,
                    value: settingValue
                }
            }).then(({data}) => {
                this.notification = "Blacklist successfully saved";
                this.loading = false;
            }).catch(({response}) => {
                this.error = response.data.request.statusMessage;
                this.loading = false;
            })
        }
    },

    created() {
        this.fillAccountList()
    },
}
</script>

<style lang="scss">
.dh-profile-general {
  overflow: auto;
}
</style>