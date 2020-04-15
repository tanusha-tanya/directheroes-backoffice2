<template>
  <div class="dh-thanks-form">
    <div class="dh-sign-title">
      Thank You!
    </div>
    <logo-pic />
    <div class="dh-sign-text">
      Your payment has been accepted.
    </div>
    <div class="dh-sign-text dh-sign-text--small">
      You can contact us to get more info at <br/>
      <a :href="`mailto:${ contactEmail }`" target="_blank">{{contactEmail}}</a>
    </div>
    <dh-button @click="goToDH">Start now!</dh-button>
  </div>
</template>

<script>
import logoPic from '../../assets/logo-pic.svg'

export default {
  components: {
    logoPic
  },

  computed: {
    contactEmail() {
      const { contactEmail } = dh;

      return contactEmail;
    }
  },

  methods: {
    goToDH() {
      window.location.href = `https://${ window.location.hostname }/${ dh.userName }/v2/`;
    }
  }
}
</script>

<style lang="scss">
  .dh-thanks-form {
    width: 435px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 32px;

    svg {
      margin: 40px;
    }

    .dh-sign-text {
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      color: #778CA2;

      &.dh-sign-text--small {
        font-size: 14px;
        line-height: 18px;
        margin-top: 16px;
      }
    }

    .dh-button {
      margin-top: 27px;
    }
  }
</style>