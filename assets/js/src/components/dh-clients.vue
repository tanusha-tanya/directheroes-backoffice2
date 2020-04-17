<template>
  <div class="landing-clients-step">
    <div class="landing-clients__header">
      <span class="landing-clients__title">Clients we’ve worked with</span>
      <span
        class="landing-clients__subtitle"
      >We are paying them back with perfect service & awesome features</span>
    </div>
    <div class="landing-clients__items">
      <div class="landing-clients-item" v-for="(client, idx) in clients" :key="idx">
        <div
          class="landing-clients-item__logo"
          :style="{'background-image': 'url(' + client.logo + ')'}"
        ></div>
        <span class="landing-clients-item__name">{{ client.name }}</span>
        <span class="landing-clients-item__login">{{ client.login }}</span>
        <span class="landing-clients-item__subscribers">{{ client.subscribers }}</span>
      </div>
    </div>
    <div class="landing-clients__footer">
      <span class="landing-clients-footer__subtitle">Any Many More</span>
      <span class="landing-clients-footer__title">Surpassing +30 000 000 followers total</span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      clients: [
        {
          logo: require("../assets/landing/bedros.png"),
          name: "Bedros Keuilian",
          login: "@bedroskeuilian",
          subscribers: "493K"
        },
        {
          logo: require("../assets/landing/tech.png"),
          name: "Technology",
          login: "@technology",
          subscribers: "4.7M"
        },
        {
          logo: require("../assets/landing/mentor.png"),
          name: "Millionaire Mentor",
          login: "@millionaire_mentor",
          subscribers: "5.7M"
        },
        {
          logo: require("../assets/landing/high.png"),
          name: "High On Life",
          login: "@highonlife",
          subscribers: "1M"
        },
        {
          logo: require("../assets/landing/mylett.png"),
          name: "Ed Mylett",
          login: "@edmylett",
          subscribers: "512K"
        },
        {
          logo: require("../assets/landing/atlantic.png"),
          name: "Atlantic Records",
          login: "@atlanticrecords",
          subscribers: "608K"
        },
        {
          logo: require("../assets/landing/talantless.png"),
          name: "TALENTLESS®",
          login: "@talentless",
          subscribers: "1M"
        },
        {
          logo: require("../assets/landing/dean.png"),
          name: "Dean Graziosi",
          login: "@deangraziosi",
          subscribers: "1M"
        },
        {
          logo: require("../assets/landing/monster.png"),
          name: "Monstercat",
          login: "@monstercat",
          subscribers: "544K"
        },
        {
          logo: require("../assets/landing/teddi.png"),
          name: "Teddi Mellencamp",
          login: "@teddimellencamp",
          subscribers: "865K"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
$clients-step-min-height: 868px;
$clients-header-title-color: $primaryDark;
$clients-header-title-font-size: $font-size-heading-h1;

$clients-header-subtitle-color: $secondaryDark1;
$clients-header-subtitle-font-size: $font-size-heading-h4;

$clients-footer-subtitle-color: $secondaryDark1;
$clients-footer-subtitle-font-size: $font-size-heading-h3;

$clients-footer-title-color: $secondary2;
$clients-footer-title-font-size: $font-size-heading-h2;

.landing-clients-step {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: $white;
  z-index: 10;

  &:before {
    content: "";
    position: absolute;
    bottom: 40%;
    width: 100%;
    height: 100%;
    min-height: $clients-step-min-height;
    background-image: url("../assets/landing/clients-step-decor.png");
    background-repeat: no-repeat;
    background-position-x: 100%;
    z-index: -1;
  }

  .landing-clients__header {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  .landing-clients__title {
    color: $clients-header-title-color;
    font-size: $clients-header-title-font-size;
    line-height: 36px;
    padding-bottom: 12px;
    font-weight: bold;
    text-align: center;
  }

  .landing-clients__subtitle {
    color: $clients-header-subtitle-color;
    font-size: $clients-header-subtitle-font-size;
    text-align: center;
  }

  .landing-clients__items {
    flex-grow: 3;
  }

  .landing-clients__footer {
    margin: -90px auto 0;
    padding-bottom: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &:before {
      content: "";
      background-image: url("../assets/landing/clients-step-cup.png");
      background-repeat: no-repeat;
      background-position-x: 100%;
      background-size: cover;
      height: 80px;
      width: 68px;
      position: relative;
      top: 68px;
      z-index: -1;
    }

    .landing-clients-footer__subtitle {
      color: $clients-footer-subtitle-color;
      font-size: $clients-footer-subtitle-font-size;
      line-height: 24px;
      padding-bottom: 6px;
    }

    .landing-clients-footer__title {
      color: $clients-footer-title-color;
      font-size: $clients-footer-title-font-size;
      line-height: 30px;
      font-weight: 500;
    }
  }

  .landing-clients__items {
    margin: 88px 190px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .landing-clients-item {
      width: 20%;
      min-height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 81px;

      .landing-clients-item__logo {
        width: 100px;
        height: 100px;
        border-radius: 100%;
        background: transparent;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }

      .landing-clients-item__name {
        font-size: $font-size-heading-h4;
        line-height: 22px;
        color: $primaryDark;
      }

      .landing-clients-item__login {
        font-size: 14px;
        line-height: 17px;
        color: $secondaryDark1;
        padding-top: 2px;
      }

      .landing-clients-item__subscribers {
        font-weight: bold;
        font-size: 18px;
        line-height: 22px;
        color: $secondaryDark1;
        padding-top: 8px;
      }
    }
  }
}

@include screen-xs {
  .landing-clients-step {
    margin-top: 90px;
    
    &:before {
      content: "";
      background-image: url("../assets/landing/clients-step-decor-mobile.png");
      bottom: 12%;
    }

    .landing-clients__items {
      margin: 55px 20px 0;

      .landing-clients-item {
        width: 49%;
      }
    }
  }
}
</style>