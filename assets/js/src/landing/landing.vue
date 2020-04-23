<template>
  <div class="dh-app">
    <div class="dh-header">
      <a href="/">
        <logo-big/>
      </a>
      <div class="dh-menu">
        <a class="dh-menu__item" href="/pricing">
          Pricing
        </a>
        <a class="dh-menu__item" href="/blog">
          Blog
        </a>
        <a class="dh-menu__item" href="#" v-if="false">
          Support
        </a>
      </div>
      <span></span>
      <div class="dh-header__buttons">
        <dh-button class="dh-button--signin" type="outline" @click="goToPath('#plans')">Create account</dh-button>
        <dh-button class="dh-button--signup" type="outline" @click="goToPath('/login')">Login</dh-button>
      </div>
    </div>
    <div class="dh-header-mobile">
      <a href="/">
        <logo-image/>
      </a>
      <div class="dh-toggle-menu" @click="showModalMenu = true">
        <svg width="28" height="21" viewBox="0 0 28 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.5 0.375V2.625H27.5V0.375H0.5ZM0.5 9.375V11.625H27.5V9.375H0.5ZM0.5 18.375V20.625H27.5V18.375H0.5Z" fill="#9E4CF9"/>
        </svg>
      </div>
      <div class="dh-header-popup" v-if="showModalMenu">
        <div class="dh-popup-controls">
          <logo-image/>
          <div class="dh-close-popup" @click="showModalMenu = false">
            <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.12109 0.00390625L0.503906 1.62109L10.3828 11.5L0.503906 21.3789L2.12109 22.9961L12 13.1172L21.8789 22.9961L23.4961 21.3789L13.6172 11.5L23.4961 1.62109L21.8789 0.00390625L12 9.88281L2.12109 0.00390625Z" fill="#9E4CF9"/>
            </svg>
          </div>
        </div>
        <div class="dh-menu dh-menu--mobile">
          <a class="dh-menu__item" href="/pricing" @click="showModalMenu = false">
            Pricing
          </a>
          <a class="dh-menu__item" href="/blog" @click="showModalMenu = false">
            Blog
          </a>
          <a class="dh-menu__item" href="#" v-if="false">
            Support
          </a>
          <a class="dh-menu__item" href="https://www.directheroes.com/privacy/">
            Privacy policy
          </a>
          <a class="dh-menu__item" href="https://www.directheroes.com/terms-and-conditions/">
            Terms & Conditions
          </a>
        </div>
        <div class="dh-header__buttons">
          <dh-button class="dh-button--signin" type="outline" @click="goToPath('#plans')">Create account</dh-button>
          <dh-button class="dh-button--signup" type="outline" @click="goToPath('/login')">Login</dh-button>
        </div>
        <span></span>
        <div class="dh-socials">
          <a class="dh-socials__item" href="https://www.instagram.com/direct.heroes/" target="_blank">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.23295 0C3.71378 0 0 3.70881 0 8.23295V19.767C0 24.2862 3.70881 28 8.23295 28H19.767C24.2862 28 28 24.2912 28 19.767V8.23295C28 3.71378 24.2912 0 19.767 0H8.23295ZM8.23295 2.54545H19.767C22.9141 2.54545 25.4545 5.08594 25.4545 8.23295V19.767C25.4545 22.9141 22.9141 25.4545 19.767 25.4545H8.23295C5.08594 25.4545 2.54545 22.9141 2.54545 19.767V8.23295C2.54545 5.08594 5.08594 2.54545 8.23295 2.54545ZM21.517 5.32955C20.8757 5.32955 20.3636 5.84162 20.3636 6.48295C20.3636 7.12429 20.8757 7.63636 21.517 7.63636C22.1584 7.63636 22.6705 7.12429 22.6705 6.48295C22.6705 5.84162 22.1584 5.32955 21.517 5.32955ZM14 6.36364C9.79901 6.36364 6.36364 9.79901 6.36364 14C6.36364 18.201 9.79901 21.6364 14 21.6364C18.201 21.6364 21.6364 18.201 21.6364 14C21.6364 9.79901 18.201 6.36364 14 6.36364ZM14 8.90909C16.8288 8.90909 19.0909 11.1712 19.0909 14C19.0909 16.8288 16.8288 19.0909 14 19.0909C11.1712 19.0909 8.90909 16.8288 8.90909 14C8.90909 11.1712 11.1712 8.90909 14 8.90909Z" fill="currentColor"/>
            </svg>
          </a>
          <a class="dh-socials__item" href="https://www.facebook.com/directheroes/" target="_blank">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 0C6.28183 0 0 6.28183 0 14C0 21.7182 6.28183 28 14 28C21.7182 28 28 21.7182 28 14C28 6.28183 21.7182 0 14 0ZM14 2.33333C20.4571 2.33333 25.6667 7.54286 25.6667 14C25.6667 19.8653 21.3636 24.6882 15.7363 25.5254V17.402H19.0586L19.5804 14.0273H15.7363V12.1839C15.7363 10.7828 16.1967 9.53841 17.5068 9.53841H19.6123V6.5944C19.2425 6.54423 18.4598 6.4349 16.9805 6.4349C13.8911 6.4349 12.0814 8.06588 12.0814 11.7829V14.0273H8.90495V17.402H12.0814V25.4958C6.54366 24.5824 2.33333 19.8019 2.33333 14C2.33333 7.54286 7.54286 2.33333 14 2.33333Z" fill="currentColor"/>
            </svg>
          </a>
          <a class="dh-socials__item" href="https://www.linkedin.com/company/direct-heroes/about/" target="_blank">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.18182 0C1.44176 0 0 1.44176 0 3.18182V24.8182C0 26.5582 1.44176 28 3.18182 28H24.8182C26.5582 28 28 26.5582 28 24.8182V3.18182C28 1.44176 26.5582 0 24.8182 0H3.18182ZM3.18182 2.54545H24.8182C25.1811 2.54545 25.4545 2.81889 25.4545 3.18182V24.8182C25.4545 25.1811 25.1811 25.4545 24.8182 25.4545H3.18182C2.81889 25.4545 2.54545 25.1811 2.54545 24.8182V3.18182C2.54545 2.81889 2.81889 2.54545 3.18182 2.54545ZM6.92045 4.73295C5.71236 4.73295 4.73295 5.71236 4.73295 6.92045C4.73295 8.12855 5.71236 9.10795 6.92045 9.10795C8.12855 9.10795 9.10795 8.12855 9.10795 6.92045C9.10795 5.71236 8.12855 4.73295 6.92045 4.73295ZM18.4148 10.5398C16.5902 10.5398 15.3771 11.5391 14.875 12.4886H14.7955V10.8182H11.2159V22.9091H14.9545V16.9432C14.9545 15.3672 15.2678 13.8409 17.2216 13.8409C19.1456 13.8409 19.1705 15.6207 19.1705 17.0227V22.9091H22.9091V16.267C22.9091 13.0156 22.218 10.5398 18.4148 10.5398ZM5.09091 10.8182V22.9091H8.86932V10.8182H5.09091Z" fill="currentColor"/>
            </svg>
          </a>
          <a class="dh-socials__item" href="https://www.youtube.com/channel/UCNzmh2GxbrgkVes0yJNbKWQ" target="_blank">
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 0C10.8365 0 7.5609 0.252084 4.17307 0.756247C3.25321 0.893753 2.45673 1.28333 1.78366 1.925C1.13301 2.56667 0.729169 3.34584 0.572111 4.26249C0.190705 6.39375 0 8.63959 0 11C0 13.3604 0.190705 15.6063 0.572111 17.7375C0.729169 18.6541 1.14423 19.4333 1.8173 20.0751C2.49039 20.7167 3.27564 21.1063 4.17307 21.2437C7.5609 21.7479 10.8365 22 14 22C17.1634 22 20.4391 21.7479 23.827 21.2437C24.7243 21.1063 25.5097 20.7167 26.1826 20.0751C26.8558 19.4333 27.2709 18.6541 27.4279 17.7375C27.8094 15.6063 28 13.3604 28 11C28 8.61667 27.8094 6.37084 27.4279 4.26249C27.2709 3.34584 26.8558 2.56667 26.1826 1.925C25.5321 1.28333 24.7468 0.893753 23.827 0.756247C20.4391 0.252084 17.1634 0 14 0ZM14 2.2C17.0961 2.2 20.2709 2.44063 23.5241 2.92188C23.9728 2.99063 24.3542 3.18541 24.6683 3.50625C25.0048 3.82708 25.218 4.21667 25.3077 4.675C25.6667 6.66875 25.8462 8.77708 25.8462 11C25.8462 13.2229 25.6667 15.3312 25.3077 17.3249C25.218 17.7833 25.0048 18.1729 24.6683 18.4937C24.3542 18.8145 23.9728 19.0094 23.5241 19.0781C20.2709 19.5594 17.0961 19.8 14 19.8C10.9039 19.8 7.72917 19.5594 4.47596 19.0781C4.02725 19.0094 3.63461 18.8145 3.29808 18.4937C2.98398 18.1729 2.78206 17.7833 2.69231 17.3249C2.33333 15.3312 2.15385 13.2229 2.15385 11C2.15385 8.77708 2.33333 6.66875 2.69231 4.675C2.78206 4.21667 2.98398 3.82708 3.29808 3.50625C3.63461 3.18541 4.02725 2.99063 4.47596 2.92188C7.70673 2.44063 10.8814 2.2 14 2.2ZM11.9678 5.39801C11.4344 5.09158 10.7692 5.47657 10.7692 6.09166V15.9083C10.7692 16.5234 11.4345 16.9084 11.9678 16.602L12.3846 16.3625L19.9231 11.9625L20.385 11.6873C20.9057 11.377 20.9057 10.623 20.385 10.3127L19.9231 10.0375L12.3846 5.63751L11.9678 5.39801ZM12.9231 8.49063L17.1972 11L12.9231 13.5094V8.49063Z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="dh-slogan">
      <div class="dh-slogan__title">Pricing that’s adapted to your size</div>
      <div class="dh-slogan__text">Providing you with the best Instagram social tools!</div>
      <a class="dh-offer" :href="`/check-out?code=${ defaultPlan }`">
        <img src="../assets/landing/offer.png" alt="" >
        <div class="dh-offer__slogan">
          <div class="dh-offer__text">
            Limited time offer!
          </div>
          <svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5" d="M1 7H35M35 7L28.4133 1M35 7L28.4133 13" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <div class="dh-offer__text-ad">
            Get <strong>HERO</strong>  plan for $97 / month
          </div>
        </div>
        <dh-button class="dh-button--get-plan" type="outline">Get plan</dh-button>
      </a>
    </div>
    <div class="dh-plans-block" id="plans">
      <div class="dh-plans-block__title">
        Plans
      </div>
      <dh-plans
        :plans="plans"
        action-text="Choose plan"
        :recommended-plan="defaultPlan"
        @select-plan="selectPlan"
      ></dh-plans>
    </div>
    <dh-clients />
    <div class="dh-connect-block">
      <div class="dh-connect-block__title">
        Empower Your Instagram Today
      </div>
       <dh-button @click="goToPath('/check-out')">Create your account</dh-button>
    </div>
    <div class="dh-footer">
      <div class="dh-footer__wrapper">
        <div class="dh-footer__controls">
          <div class="dh-menu dh-menu--light">
            <a class="dh-menu__item" href="/pricing">
              Pricing
            </a>
            <a class="dh-menu__item" href="/blog">
              Blog
            </a>
            <a class="dh-menu__item" href="#" v-if="false">
              Support
            </a>
            <a class="dh-menu__item" href="#" v-if="false">
              is Direct Heroes Safe
            </a>
            <a class="dh-menu__item" href="https://www.directheroes.com/privacy/">
              Privacy policy
            </a>
            <a class="dh-menu__item" href="https://www.directheroes.com/terms-and-conditions/">
              Terms & Conditions
            </a>
          </div>
          <div class="dh-socials">
            <a class="dh-socials__item" href="https://www.instagram.com/direct.heroes/" target="_blank">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.23295 0C3.71378 0 0 3.70881 0 8.23295V19.767C0 24.2862 3.70881 28 8.23295 28H19.767C24.2862 28 28 24.2912 28 19.767V8.23295C28 3.71378 24.2912 0 19.767 0H8.23295ZM8.23295 2.54545H19.767C22.9141 2.54545 25.4545 5.08594 25.4545 8.23295V19.767C25.4545 22.9141 22.9141 25.4545 19.767 25.4545H8.23295C5.08594 25.4545 2.54545 22.9141 2.54545 19.767V8.23295C2.54545 5.08594 5.08594 2.54545 8.23295 2.54545ZM21.517 5.32955C20.8757 5.32955 20.3636 5.84162 20.3636 6.48295C20.3636 7.12429 20.8757 7.63636 21.517 7.63636C22.1584 7.63636 22.6705 7.12429 22.6705 6.48295C22.6705 5.84162 22.1584 5.32955 21.517 5.32955ZM14 6.36364C9.79901 6.36364 6.36364 9.79901 6.36364 14C6.36364 18.201 9.79901 21.6364 14 21.6364C18.201 21.6364 21.6364 18.201 21.6364 14C21.6364 9.79901 18.201 6.36364 14 6.36364ZM14 8.90909C16.8288 8.90909 19.0909 11.1712 19.0909 14C19.0909 16.8288 16.8288 19.0909 14 19.0909C11.1712 19.0909 8.90909 16.8288 8.90909 14C8.90909 11.1712 11.1712 8.90909 14 8.90909Z" fill="white"/>
              </svg>
            </a>
            <a class="dh-socials__item" href="https://www.facebook.com/directheroes/" target="_blank">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0C6.28183 0 0 6.28183 0 14C0 21.7182 6.28183 28 14 28C21.7182 28 28 21.7182 28 14C28 6.28183 21.7182 0 14 0ZM14 2.33333C20.4571 2.33333 25.6667 7.54286 25.6667 14C25.6667 19.8653 21.3636 24.6882 15.7363 25.5254V17.402H19.0586L19.5804 14.0273H15.7363V12.1839C15.7363 10.7828 16.1967 9.53841 17.5068 9.53841H19.6123V6.5944C19.2425 6.54423 18.4598 6.4349 16.9805 6.4349C13.8911 6.4349 12.0814 8.06588 12.0814 11.7829V14.0273H8.90495V17.402H12.0814V25.4958C6.54366 24.5824 2.33333 19.8019 2.33333 14C2.33333 7.54286 7.54286 2.33333 14 2.33333Z" fill="white"/>
              </svg>
            </a>
            <a class="dh-socials__item" href="https://www.linkedin.com/company/direct-heroes/about/" target="_blank">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.18182 0C1.44176 0 0 1.44176 0 3.18182V24.8182C0 26.5582 1.44176 28 3.18182 28H24.8182C26.5582 28 28 26.5582 28 24.8182V3.18182C28 1.44176 26.5582 0 24.8182 0H3.18182ZM3.18182 2.54545H24.8182C25.1811 2.54545 25.4545 2.81889 25.4545 3.18182V24.8182C25.4545 25.1811 25.1811 25.4545 24.8182 25.4545H3.18182C2.81889 25.4545 2.54545 25.1811 2.54545 24.8182V3.18182C2.54545 2.81889 2.81889 2.54545 3.18182 2.54545ZM6.92045 4.73295C5.71236 4.73295 4.73295 5.71236 4.73295 6.92045C4.73295 8.12855 5.71236 9.10795 6.92045 9.10795C8.12855 9.10795 9.10795 8.12855 9.10795 6.92045C9.10795 5.71236 8.12855 4.73295 6.92045 4.73295ZM18.4148 10.5398C16.5902 10.5398 15.3771 11.5391 14.875 12.4886H14.7955V10.8182H11.2159V22.9091H14.9545V16.9432C14.9545 15.3672 15.2678 13.8409 17.2216 13.8409C19.1456 13.8409 19.1705 15.6207 19.1705 17.0227V22.9091H22.9091V16.267C22.9091 13.0156 22.218 10.5398 18.4148 10.5398ZM5.09091 10.8182V22.9091H8.86932V10.8182H5.09091Z" fill="white"/>
              </svg>
            </a>
            <a class="dh-socials__item" href="https://www.youtube.com/channel/UCNzmh2GxbrgkVes0yJNbKWQ" target="_blank">
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0C10.8365 0 7.5609 0.252084 4.17307 0.756247C3.25321 0.893753 2.45673 1.28333 1.78366 1.925C1.13301 2.56667 0.729169 3.34584 0.572111 4.26249C0.190705 6.39375 0 8.63959 0 11C0 13.3604 0.190705 15.6063 0.572111 17.7375C0.729169 18.6541 1.14423 19.4333 1.8173 20.0751C2.49039 20.7167 3.27564 21.1063 4.17307 21.2437C7.5609 21.7479 10.8365 22 14 22C17.1634 22 20.4391 21.7479 23.827 21.2437C24.7243 21.1063 25.5097 20.7167 26.1826 20.0751C26.8558 19.4333 27.2709 18.6541 27.4279 17.7375C27.8094 15.6063 28 13.3604 28 11C28 8.61667 27.8094 6.37084 27.4279 4.26249C27.2709 3.34584 26.8558 2.56667 26.1826 1.925C25.5321 1.28333 24.7468 0.893753 23.827 0.756247C20.4391 0.252084 17.1634 0 14 0ZM14 2.2C17.0961 2.2 20.2709 2.44063 23.5241 2.92188C23.9728 2.99063 24.3542 3.18541 24.6683 3.50625C25.0048 3.82708 25.218 4.21667 25.3077 4.675C25.6667 6.66875 25.8462 8.77708 25.8462 11C25.8462 13.2229 25.6667 15.3312 25.3077 17.3249C25.218 17.7833 25.0048 18.1729 24.6683 18.4937C24.3542 18.8145 23.9728 19.0094 23.5241 19.0781C20.2709 19.5594 17.0961 19.8 14 19.8C10.9039 19.8 7.72917 19.5594 4.47596 19.0781C4.02725 19.0094 3.63461 18.8145 3.29808 18.4937C2.98398 18.1729 2.78206 17.7833 2.69231 17.3249C2.33333 15.3312 2.15385 13.2229 2.15385 11C2.15385 8.77708 2.33333 6.66875 2.69231 4.675C2.78206 4.21667 2.98398 3.82708 3.29808 3.50625C3.63461 3.18541 4.02725 2.99063 4.47596 2.92188C7.70673 2.44063 10.8814 2.2 14 2.2ZM11.9678 5.39801C11.4344 5.09158 10.7692 5.47657 10.7692 6.09166V15.9083C10.7692 16.5234 11.4345 16.9084 11.9678 16.602L12.3846 16.3625L19.9231 11.9625L20.385 11.6873C20.9057 11.377 20.9057 10.623 20.385 10.3127L19.9231 10.0375L12.3846 5.63751L11.9678 5.39801ZM12.9231 8.49063L17.1972 11L12.9231 13.5094V8.49063Z" fill="white"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="dh-footer__info">
          <div>
            *Disclaimer: Direct Heroes is in no way affiliated with Instagram, and is a 3rd party web application.<br>
            ©2020 Copyright Direct Heroes Inc., All rights reserved.
          </div>
          <svg width="52" height="35" viewBox="0 0 52 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.12" fill-rule="evenodd" clip-rule="evenodd" d="M51.2725 0.0643797L0.489896 15.5907C-0.122709 15.7775 -0.167262 16.1544 0.392834 16.426L10.5602 21.4231L15.3062 34.3281C15.4096 34.6578 15.634 34.8918 15.9252 34.9703C15.9968 34.9907 16.0716 35.0001 16.1464 35.0001C16.401 35.0001 16.6667 34.8886 16.9006 34.6782L24.3656 28.0322C24.7299 28.2068 24.9848 28.3292 25.0768 28.3738L32.6684 32.0356C33.2301 32.3057 33.9095 32.1408 34.18 31.6666L51.8978 0.584122C52.1667 0.111486 51.8867 -0.122476 51.2725 0.0643797ZM15.9093 34.1302L11.265 21.499L21.1737 17.3493L17.2109 16.0494L19.5028 15.1688L30.0875 11.2585L26.7858 10.3509L46.2669 4.65329L46.192 4.73097L35.5532 9.95047L38.1901 10.6736L38.2073 10.6944L35.5498 9.96509V12.2322L28.0714 15.5185L33.3192 17.1829L33.3188 17.183L28.0555 15.52V19.6555L17.3612 24.6791C17.3624 24.6797 17.3637 24.6803 17.365 24.6809L16.2496 33.9499L16.2027 34.3671C16.1632 34.375 16.1264 34.3748 16.0939 34.3657C15.9888 34.3375 15.9363 34.215 15.9093 34.1302ZM23.7452 27.7409L23.7496 27.737C23.3343 27.538 22.8513 27.3068 22.3403 27.0622L23.7452 27.7409Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logoBig from '../assets/logo-big.svg'
import logoImage from '../assets/logo-image.svg'
import dhPlans from '../components/dh-plans'
import dhClients from "../components/dh-clients";

export default {
  data() {
    return {
      showModalMenu: false,
    }
  },

  components: {
    logoBig,
    dhPlans,
    logoImage,
    dhClients
  },

  computed: {
    plans() {
      const { plans } = dh;

      plans.forEach(element => element.parameters.sort((a,b) => a.priority - b.priority));

      return plans;
    },

    defaultPlan() {
      const { defaultPlan } = dh;

      return defaultPlan
    }
  },

  methods: {
    goToPath(path) {
      this.showModalMenu = false;

      if (/^#/.test(path)) {
        window.location.hash = '';
        window.location.hash = path;
        return;
      }

      window.location.href = window.location.origin + path;
    },

    selectPlan(plan) {
      const { goToPath } = this;

      goToPath(`/check-out?code=${ plan.code }`);
    }
  },

  created() {
    const referrer = /ref=([^&]*)/.exec(location.search);

    if (referrer && referrer[1]) {
      document.cookie = 'referrer=' + referrer[1] + '; path=/; max-age=2592000'
    }
  }
}
</script>

<style lang="scss">
@import '../styles/fonts.scss';
@import '../styles/variables.scss';

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  height: 100vh;
  background-color: $white;
  font: 14px/17px Rubik, sans-serif;
  color: $elementsColor;
  background-image: url(../assets/landing/bg-top.png);
  background-position: 100% 0;
  background-repeat: no-repeat;
}

.dh-colored-text {
  background: linear-gradient(90deg, #661ACE 30.16%, #2665F9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #661ACE;
}

.dh-header {
  padding: 30px 60px;
  display: flex;
  align-items: center;

  & > span {
    flex-grow: 1;
  }

  .dh-menu {
    margin: 15px 0 0 60px;
  }
}

.dh-header-mobile {
  display: none;
}

.dh-menu {
  text-transform: uppercase;

  &.dh-menu--light {
    color: rgba($white, .8);
  }

  &.dh-menu--mobile {
    display: flex;
    flex-direction: column;
    padding: 0 16px 0 32px;

    .dh-menu__item {
      color: inherit;
      text-decoration: none;
      color: $elementActiveColor;
      font-weight: 500;

      & + .dh-menu__item {
        margin-left: 0;
        margin-top: 28px;
      }
    }
  }
}

.dh-menu__item {
  color: inherit;
  text-decoration: none;

  & + .dh-menu__item {
    margin-left: 32px;
  }
}

button.dh-button--signin {
  min-width: 160px;
}

button.dh-button.dh-button--signup {
  min-width: 120px;
}

button.dh-button.dh-button + .dh-button {
  margin-left: 20px;
}

.dh-slogan {
  padding: 100px 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dh-slogan__title {
  font-size: 48px;
  line-height: 57px;
  color: #252631;
}

.dh-slogan__text {
  font-size: 20px;
  line-height: 24px;
  margin-top: 20px;
}

.dh-button.dh-button--get-plan.dh-button--get-plan {
  background: transparent;
  border-color: $white;
  color: $white;
  align-self: center;
  margin-right: 20px;
  min-width: 120px;
}

.dh-offer {
  display: flex;
  align-items: flex-end;
  margin-top: 100px;
  max-width: 1200px;
  width: 100%;
  height: 80px;
  background: linear-gradient(86.21deg, #F79D4D 0.03%, #C4138E 76.83%, #9613C4 97.04%);
  border-radius: 4px;
  color: $white;
  text-decoration: none;
}

.dh-offer__slogan {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;

  svg {
    margin: 0 16px;
  }
}

.dh-offer__text {
  font-weight: bold;
  font-size: 28px;
  line-height: 36px;
}

.dh-offer__text-ad {
  font-size: 28px;
  line-height: 33px;
  text-transform: uppercase;
}

.dh-plans-block {
  max-width: 1200px;
  margin: 0 auto 120px;
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0px 2px 80px rgba(27, 30, 36, 0.05);
  border-radius: 4px;
  padding: 40px 28px 24px;
  position: relative;
}

.dh-plans-block__title {
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  text-align: center;
  color: #000000;
  margin-bottom: 32px;
}

.dh-plan-list {
  margin-top: 28px;
}

.dh-our-clients {
  position: relative;
  background-color: #F8FAFB;
  padding: 60px 0 70px;

  img {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.dh-our-clients__wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.dh-our-client__title {
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  color: #252631;
}

.dh-our-client__text {
  font-size: 18px;
  line-height: 22px;
  color: #778CA2;
  margin-top: 12px;
}

.dh-our-client-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 70px;
}

.dh-our-client-list__item {
  width: 20%;
  height: 100px;
  background-position: center;
  background-repeat: no-repeat;
}

.dh-connect-block {
  padding: 120px 0;
  text-align: center;

  .dh-button {
    margin-top: 58px;
  }
}

.dh-connect-block__title {
  font-weight: 500;
  font-size: 42px;
  line-height: 50px;
  color: #252631;
}

.dh-footer {
  padding: 40px 0 22px;
  background: linear-gradient(81.34deg, #661ACE -2.85%, #3C4FE7 64.46%);
  box-shadow: 0px -4px 20px rgba(153, 155, 168, 0.22);
}

.dh-footer__wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.dh-footer__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dh-socials {
  display: flex;
  align-items: center;
}

.dh-socials__item {
  & + .dh-socials__item {
    margin-left: 16px;
  }
}

.dh-footer__info {
  display: flex;
  font-size: 12px;
  line-height: 14px;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 16px;
  color: $white;
  border-top: 1px solid rgba($white, .1);
}

@include  screen-xs {
  body {
    background-size: 110%;
  }

  .dh-header {
    display: none;
  }

  .dh-header-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
  }

  .dh-header-popup {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    background: linear-gradient(90deg, #EFF4FA 0%, #F8FAFB 10%) #F8FAFB;

    & > span {
      flex-grow: 1;
    }

    .dh-socials {
      justify-content: space-around;
      margin: 0 16px;
      padding: 24px 0;
      border-top: 1px solid #E8ECEF;
    }

    .dh-socials__item {
      color: $elementActiveColor;

      & + .dh-socials__item {
        margin-left: 0;
      }
    }
  }

  .dh-popup-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 26px 32px;

    & > svg {
      height: 24px !important;
      width: 36px !important;
    }
  }

  .dh-header__buttons {
    margin-top: 40px;

    button.dh-button {
      display: block;
      width: 206px;
      height: 40px;
      padding: 0;
      margin: 0 auto;
      background-color: transparent;

      & + .dh-button {
        margin-left: auto;
        margin-top: 16px;
      }
    }
  }

  .dh-slogan {
    padding: 60px 16px 48px;
    text-align: center;
  }

  .dh-slogan__title {
    font-size: 30px;
    line-height: 36px;
  }

  .dh-slogan__text {
    font-size: 18px;
    line-height: 22px;
    padding: 0 10px;
  }

  .dh-offer {
    height: 175px;
    margin-top: 28px;
    position: relative;

    .dh-button--get-plan {
      position: absolute;
      bottom: 20px;
      right: 20px;
      height: 40px;
      width: 200px;
      padding: 0;
      margin-right: 0 !important;
    }
  }

  .dh-offer__slogan {
    flex-direction: column;
    align-self: flex-start;
    align-items: flex-start;
    text-align: left;
    margin-top: 20px;

    & > svg {
      display: none;
    }
  }

  .dh-offer__text {
    font-size: 18px;
    line-height: 21px;
  }

  .dh-offer__text-ad {
    margin-top: 8px;
    font-size: 22px;
    line-height: 26px;
  }

  .dh-plans-block {
    margin: 0 16px 40px;
    padding: 16px;
    width: calc(100% - 32px);

    .dh-plan-list {
      width: 100%;
      margin: 0;
    }
  }

  .dh-plans-block__title {
    margin-bottom: 0;
  }

  .dh-our-clients {
    padding: 48px 38px;

    img {
      width: 80%;
    }
  }

  .dh-our-client__title {
    font-size: 24px;
    line-height: 36px;
  }

  .dh-our-client__text {
    font-size: 16px;
    line-height: 21px;
    margin: 8px -2px 0;
  }

  .dh-our-client-list {
    flex-direction: column;
  }

  .dh-our-client-list__item {
    width: 100%;
    height: 80px;
  }

  .dh-connect-block {
    padding: 60px 55px;

    .dh-button {
      margin-top: 28px;
      width: 100%;
    }
  }

  .dh-connect-block__title {
    font-size: 28px;
    line-height: 33px;
  }

  .dh-footer__controls {
    flex-direction: column;

    .dh-menu {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .dh-menu__item {
      & + .dh-menu__item {
        margin-left: 0;
        margin-top: 24px;
      }
    }

    .dh-socials {
      margin-top: 40px;
    }

    .dh-socials__item {
      & + .dh-socials__item {
        margin-left: 28px;
      }
    }
  }

  .dh-footer__info {
    margin: 40px 17px 0;
    padding: 24px 0 0;
    flex-direction: column;

    svg {
      order: -1;
    }

    div {
      margin-top: 24px;
      text-align: center;
    }
  }
}
</style>
