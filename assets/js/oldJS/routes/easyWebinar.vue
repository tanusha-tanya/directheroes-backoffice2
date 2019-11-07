<template></template>

<script>
  export default {

    beforeRouteEnter(to, from, next) {
      let url = `${ dh.easywebinarLink }/oneclick-registration?attendee_name=${ dh.userName }&attendee_email=${ dh.userName }`
      window.open(url, "Webinar join", "width=800,height=700,top=200,left=200");
    }

  }
</script>

<style lang="scss"></style>
