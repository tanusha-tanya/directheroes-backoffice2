<template>
  <div class="request-action">
    <input placeholder="Please enter hook URL" v-model="element.value.url">
    <button :disabled="locading || !element.value.url.length" @click="testHookUrl">Send test</button>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      error: null,
    }
  },

  props:['element'],

  methods: {
    testHookUrl() {
      const { value } =  this.element

      this.loading = true

      axios({
        url: `${ dh.apiUrl }/api/2.0.0/${ dh.userName }/campaign/send-request`,
        method: 'POST',
        data: value,
      }).then(({ data }) => {
        console.log(data);
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.request-action {
  padding: 9px 20px 13px;
  text-align: center;

  input {
    width: 100%;
  }

  button {
    margin-top: 10px;
  }

}
</style>
