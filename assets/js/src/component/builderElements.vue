<template>
  <div class="builder-elements">
    <component
      :is="Drag"
      :transfer-data="stepData"
      class="builder-element step-add"
      v-if="!type"
    >
      <div class="icon" :style="{'background-image': `url(${plus})`}"/>
    </component>
    <component
      :is="Drag"
      :transfer-data="element.template"
      class="builder-element"
      v-for="element in elements"
      :key="element.name"
      v-if="visible(element)"
    >
      <div class="icon" :style="{'background-image': `url(${element.svg})`}"/>
      <div class="builder-element-title">{{element.name}}</div>
    </component>
  </div>
</template>
<script>
import { Drag } from 'vue-drag-drop';
import image from '../assets/svg/image.svg'
import chatbubble from '../assets/svg/chatbubble.svg'
import flash from '../assets/svg/flash.svg'
import subscribe from '../assets/svg/subscribe.svg'
import stopwatch from '../assets/svg/stopwatch.svg'
import socialyoutube from '../assets/svg/social-youtube.svg'
import navicon from '../assets/svg/navicon.svg'
import infinite from '../assets/svg/infinite.svg'
import plus from '../assets/svg/plus-outline.svg'

export default {
  data() {
    return {
      plus,
      stepData: {
        elements: [],
        name: "New Step",
        type: "regular",
      },
      elements: [
        {
          name: 'Image',
          svg: image,
          template: {
            type: 'sendImageAction',
            value: null
          }
        },
        {
          name: 'Text',
          svg: chatbubble,
          template: {
            type: 'sendTextAction',
            value: {
              text: ''
            }
          }
        },
        {
          name: 'Triggers',
          svg: flash,
          template: {
            type: 'messageConditionMultiple',
            value: {
              conditionList:[]
            }
          }
        },
        {
          name: 'Delay',
          svg: stopwatch,
          template: {
            type: 'basicDelay',
            value: {
              seconds: 1
            }
          }
        },
        {
          name: 'Subscribe',
          svg: subscribe,
          template: {
            type: 'subscriptionControl',
            value: {
              action: 'subscribe'
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
  },

  props:['type'],

  methods: {
    visible(element) {
      if (this.dhAccount.isViewedByAdmin) return true;

      return !['Subscribe'].includes(element.name)
    }
  }
}
</script>
<style lang="scss">
  .builder-elements {
    position: fixed;
    top: calc(50% - 200px);
    z-index: 2;
    right: 20px;
    width: 79px;
    background: #FFFFFF;
    border: 2px solid #E8E8E8;
    border-radius: 10px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.16);

    .builder-element {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #A9A9A9;
      height: 75px;
      width: 100%;

      &.step-add .icon{
        width: 43px;
        height: 43px;
      }

      .icon {
        width: 23px;
        height: 23px;
        pointer-events: none;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
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
