<template>
  <div class="builder-elements">
    <component 
      :is="Drag" 
      :transfer-data="element.template"
      class="builder-element" 
      v-for="element in elements" 
      :key="element.name"
    >
      <img :src="element.svg"/>
      <div class="builder-element-title">{{element.name}}</div>
    </component>
  </div>    
</template>
<script>
import { Drag } from 'vue-drag-drop';
import image from '../assets/svg/image.svg'
import chatbubble from '../assets/svg/chatbubble.svg'
import flash from '../assets/svg/flash.svg'
import stopwatch from '../assets/svg/stopwatch.svg'
import socialYoutube from '../assets/svg/social-youtube.svg'
import navicon from '../assets/svg/navicon.svg'
import infinite from '../assets/svg/infinite.svg'

export default {
  data() {
    return {
      elements: [
        { 
          name: 'Image', 
          svg: image,
          template: {
            class: 'action',
            type: 'sendImageAction',
            value: null
          }
        },
        { 
          name: 'Text', 
          svg: chatbubble, 
          template: {
            class: 'action',
            type: 'sendTextAction',
            message: {
              messageText: ''
            }
          }
        },
        // { name: 'Triggers', svg: flash },
        { 
          name: 'Delay', 
          svg: stopwatch,
          template: {
            class: 'condition',
            type: 'basicDelay',
            value: {
              seconds: 0
            }
          }  
        },
        // { 
        //   name: 'Video', 
        //   svg: socialYoutube,
        // },
        // { name: 'List', svg: navicon },
        // { name: 'User Input', svg: infinite },
      ],
      Drag
    }
  }
}
</script>
<style lang="scss">
  .builder-elements {
    position: fixed;
    top: calc(50% - 265px);
    z-index: 2;
    right: 0;
    width: 79px;
    background: #FFFFFF;
    border: 2px solid #E8E8E8;
    border-radius: 10px 0px 0px 10px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.16);

    .builder-element {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #A9A9A9;
      height: 75px;
      width: 100%;

      img {
        max-width: 23px;
        max-height: 23px;
        pointer-events: none;
      }

      &:not(:last-child) {
        border-bottom: 2px solid #E8E8E8;
      }

      .builder-element-title {
        margin-top: 7px;
        font-family: 'AbeatbyKai';
        font-size: 12px;
      }
    }
  }
</style>
