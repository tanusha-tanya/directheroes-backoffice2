<template>
  <div class="dh-login-form">
    <label>User Name</label>
    <input type="text" v-model="username">
    <label>Password</label>
    <input type="password" v-model="password">
    <div>{{status}}</div>
    <button @click="login">Login</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: '',
      status: null
    }
  },

  methods: {
    login() {
      const { username, password } = this;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/auth/login`,
        method: 'post',
        withCredentials: true,
        data: {
          username,
          password
        }
      }).then(({data}) => {
        console.log(data);

      })

    }
  }
}
</script>

<style lang="scss">

</style>