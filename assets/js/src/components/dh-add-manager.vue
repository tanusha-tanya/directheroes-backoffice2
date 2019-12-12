<template>
    <el-dialog
            :visible="isShow"
            width="554px"
            append-to-body
            title="Manager creation"
            :close-on-click-modal="true"
            :destroy-on-close="true"
            :show-close="false"
            class="dh-wizzard-dialog"
    >
        <div class="dh-wizzard-step dh-select-account">
            <div class="dh-wizzard-step-body">
                <div class="dh-select-account-controls">
                    <input ref="email" class="dh-input" type="text" v-model="email" @input="error = null" placeholder="Enter new user email" :disabled="creating" @keypress.enter="createManager"/>
                </div>
                <div class="dh-wizzard-error" v-if="error">
                    {{error}}
                </div>
            </div>
            <div class="el-dialog__footer">
                <span></span>
                <button :class="{'dh-button': true, 'dh-loading': creating}" :disabled="creating" @click="createManager">Create</button>
                <button :class="{'dh-button': true, 'dh-loading': creating}" :disabled="creating" @click="selfClose">Close</button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                email: '',
                creating: false,
                isShow: true,
                error: ''
            }
        },

        methods: {
            createManager() {
                this.error = ''
                if (!this.email) {
                    this.error = 'Incorrect email'
                    return
                }
                this.creating = true
                axios.post(
                    `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/child-user`, {
                        email: this.email
                    }, {
                        timeout: 30000
                    }
                ).then(() => {
                    this.selfClose()
                }).catch((error) => {
                    if (error.response && typeof error.response.data.request !== "undefined") {
                        this.error = error.response.data.request.statusMessage
                    } else {
                        this.error = 'Something goes wrong. Please try again later or contact with our support.'
                    }
                    this.creating = false
                })
            },
            selfClose() {
                this.isShow = false
                this.$emit('closing')
            }
        },

        created() {
            this.isShow = true
        },
        mounted() {
            this.$nextTick().then(()=>{
                this.$refs.email.focus()
            })
        }
    }
</script>

<style lang="scss">
    div.dh-wizzard-dialog {
        .el-dialog__body {
            padding: 0 !important;
        }

        .dh-wizzard-step-body {
            padding: 28px 31px 22px 24px;
            min-height: 200px;
        }

        .el-dialog__footer {
            background-color: #ffffff;
            justify-content: flex-end;
            min-height: 64px;
        }

        .dh-wizzard-error, .dh-wizzard-success {
            height: 80px;
            width: 100%;
            background-color: #FE4D97;
            border-radius: 4px;
            margin-top: 20px;
            padding: 0 24px;
            display: flex;
            align-items: center;
            color: #ffffff;
            font-size: 16px;
        }

        .dh-wizzard-success {
            background-color: $successColor;
        }
    }
</style>
