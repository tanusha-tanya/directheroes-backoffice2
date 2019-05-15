<template>
 <div class="account-dh" v-if="dhAccount">
   <div class="container-area w800">
     <div class="menu">
       <router-link :to="{ name: 'dhProfile'}" class="menu-item root-element">
         <img src="../assets/svg/avatar-b.svg">
       </router-link>
       <router-link :to="{ name: 'dhPayments'}" class="menu-item">
         Payments
       </router-link>
       <router-link :to="{ name: 'dhSubscriptions'}" class="menu-item" v-if="false">
         Subscriptions
       </router-link>
     </div>
     <router-view></router-view>
   </div>
 </div>
</template>
<script>
export default {
}
</script>
<style lang="scss">
.account-dh {
  padding: 20px;
  height: calc(100% - 50px);
  display: flex;
  align-items: center;

  .container-area {
    width: 100%;
    height: 600px;
    overflow: hidden;
    max-height: 100%;
  }

  .menu {
    display: flex;
    border-bottom: 1px solid #EEEEEE;

    .menu-item {
      padding: 11px 16px;
      border-right: 1px solid #EEEEEE;
      text-decoration: none;
      color: inherit;
      display: flex;
      align-items: center;

      &.router-link-exact-active {
        background-color: #F8F8F8;
      }
    }
  }
}
</style>
