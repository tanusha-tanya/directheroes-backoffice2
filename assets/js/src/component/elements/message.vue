<template>
  <div class="message-items">
    <template v-for="element in elements">
      <div class="message-item" v-if="element.type !== 'linker'" :key="element.id">
        <element-warning :element="element"></element-warning>
        <template v-if="element.type === 'group' && element.displaySettings.type === 'delay'">
          <delay :element="element"></delay>
        </template>
        <template v-else-if="element.type === 'group' && element.displaySettings.type === 'delayTill'">
          <div class="message-delay-till">
            Wait till campaign entry closes
          </div>
        </template>
        <template v-else-if="element.body && element.body.action === 'sendText'">
          <el-input
            type="textarea"
            placeholder="Please input"
            :autosize="{maxRows: 10}"
            v-model="element.body.text"
            @wheel.native="scrollBlock"
          >
          </el-input>
          <div class="text-counter">{{countTextLength(element.body.text)}}/1000</div>
        </template>
        <template v-else-if="element.body && element.body.action === 'sendMedia'">
          <div class="send-media-preview" v-if="element.body.mediaId" :style="{'background-image': `url(${ dh.apiUrl }/api/1.0.0/${ dh.userName }/file/get?id=${ element.body.mediaId }&format=instagram)`}"></div>
          <div class="send-media-blank" v-else>
            <svg width="95" height="95" viewBox="0 0 95 95" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M70.5577 33.6937H61.6334L56.2921 28.3388C56.2921 28.3388 56.2656 28.3125 56.2524 28.3125L56.226 28.2862C55.4327 27.4987 54.3618 27 53.1454 27H42.0397C40.744 27 39.5938 27.5512 38.7873 28.4306V28.4438L33.5649 33.6937H24.4423C21.9832 33.6937 20 35.61 20 38.0513V64.5769C20 67.0181 21.9832 69 24.4423 69H70.5577C73.0036 69 75 67.0181 75 64.5769V38.0513C75 35.61 73.0036 33.6937 70.5577 33.6937ZM47.5 62.3719C40.7704 62.3719 35.2837 56.9119 35.2837 50.2181C35.2837 43.5112 40.7704 38.0644 47.5 38.0644C54.2428 38.0644 59.7163 43.5112 59.7163 50.2181C59.7163 56.9119 54.2428 62.3719 47.5 62.3719ZM67.8738 38.865C67.8738 39.8888 68.7067 40.7156 69.7248 40.7156C70.7428 40.7156 71.5757 39.8888 71.5757 38.865C71.5757 37.8412 70.7428 37.0144 69.7248 37.0144C68.7067 37.0144 67.8738 37.8412 67.8738 38.865Z" fill="currentColor"/>
              <path d="M48.5 41C43.2464 41 39 45.2479 39 50.5C39 55.7386 43.2464 60 48.5 60C53.74 60 58 55.7521 58 50.5C58 45.2479 53.74 41 48.5 41Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M47.623 94.2461C73.3722 94.2461 94.2461 73.3722 94.2461 47.623C94.2461 21.8738 73.3722 1 47.623 1C21.8738 1 1 21.8738 1 47.623C1 73.3722 21.8738 94.2461 47.623 94.2461Z" stroke="currentColor"/>
            </svg>
          </div>
          <div class="send-media-upload">
            <input type="file" accept="image/jpeg,image/png,image/gif" @change="uploadImage($event, element)"/>
            <svg width="23" height="14" viewBox="0 0 23 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.7953 5.89167C18.7953 5.83333 18.8056 5.775 18.8056 5.71667C18.8056 2.55694 16.1462 0 12.8656 0C10.4989 0 8.46585 1.33194 7.51094 3.25694C7.09509 3.05764 6.6279 2.94097 6.13504 2.94097C4.62054 2.94097 3.35759 4.00556 3.11629 5.39583C1.29888 5.98889 0 7.63681 0 9.57639C0 12.0167 2.05871 14 4.59487 14H9.85714V10.1111H7.38259L11.5 6.04236L15.6174 10.1062H13.1429V13.9951H18.8056C21.1261 13.9951 23 12.1722 23 9.94097C23 7.70972 21.1158 5.89653 18.7953 5.89167Z" fill="currentColor"/>
            </svg>
          </div>
        </template>
        <template v-else>
          {{element}}
          <div class="unknown-message-wrapper">
            Unknown element
          </div>
        </template>
        <div class="message-delete-button" @click="deleteMessage(element)" v-if="elements.length > (linker ? 2 : 1)">
          <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.018 10L21 18.554 19.48 20l-8.98-8.554L1.518 20 0 18.554 8.98 10 0 1.446 1.518 0 10.5 8.554 19.48 0 21 1.446z" fill="currentColor" fill-rule="evenodd"/></svg>
        </div>
      </div>
    </template>
    <div class="message-add-button" v-if="!linker">
      <add-element-popup @add-element="addElement">
        <div class="message-add-event">

        </div>
      </add-element-popup>
    </div>
    <linker :linker="linker" v-if="linker"></linker>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import addElementPopup from '../addElementPopup';
import delay from './delay';
import linker from '../linker'
import { userInputSubscriber } from '../../elements/userInput'
import ObjectId from '../../utils/ObjectId';
import elementWarning from '../elementWarning'

export default {
  props: ['elements'],

  components: {
    addElementPopup,
    elementWarning,
    linker,
    delay
  },

  computed: {
    dh() {
      return dh
    },

    linker() {
      const { elements } = this;

      return elements.find(element => element.type === 'linker');
    }
  },

  methods: {
    addElement(element) {
      const { elements } = this;
      const { displaySettings } = element;

      if (['group', 'action'].includes(element.type) && displaySettings && displaySettings.subType === 'message') {
        if (element.type === 'group') {
          element.elements.forEach(element => {
            element.id = (new ObjectId).toString()
          })

          if (['delay', 'delayTill'].includes(element.displaySettings.type)) {
            const { elements } = element;
            const checkpoint = elements.find(element => element.type === 'checkpoint');
            const action = elements.find(element => element.type === 'action');

            action.body.checkpointId = checkpoint.id;
          }
        }

        elements.push({
          id: (new ObjectId).toString(),
          ...element
        })
      } else {
        let subStep = null;
        const step = {
          id: (new ObjectId).toString(),
          elements: [
            {
              id: (new ObjectId).toString(),
              ...element
            }
          ]
        }

        if (element.type === 'group') {
          element.elements.forEach(element => {
            element.id = (new ObjectId).toString()
          })

          if (displaySettings.subType === 'user-input') {
            const rule = element.elements.find(element => element.type === 'rule');

            subStep = {
              id: (new ObjectId).toString(),
              elements: [
                {
                  id: (new ObjectId).toString(),
                  ...userInputSubscriber
                }
              ]
            }

            rule.onMatch = {action: 'goto', target: subStep.id}
          }
        }

        elements.push({
          id: (new ObjectId).toString(),
          type: 'linker',
          target: step.id
        })

        this.$emit('add-step', step);

        if (subStep) {
          this.$emit('add-step', subStep);
        }
      }
    },

    uploadImage(event, element) {
      const files = event.target.files;
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('file', file, file.name);
      }

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/file/upload`,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(({ data }) => {
        Vue.set(element.body, 'mediaId', data.response.body.id);
      });

      event.preventDefault();
    },

    elementClass(classType) {
      const classTypes = {
        sendText: 'send-text-message',
        sendMedia: 'send-media-message',
      }

      return classTypes[classType] || 'unknown-message'
    },

    deleteMessage(element) {
      const { elements } = this;

      elements.splice(elements.indexOf(element), 1);
    },

    countTextLength(text) {
      return new Blob([text]).size
    },

    scrollBlock(event) {
      event.stopPropagation();
    }
  }
}
</script>

<style lang="scss">
.message-items {
  background-color: #fff;
  border: 1px solid #D8D8D8;
  border-top: 0;
  border-radius: 0 0 5px 5px;

  .message-item {
    padding: 18px 18px 0;
    // border-bottom: 1px solid #D8D8D8;
    position: relative;

    .element-warning {
      right: 24px;
      top: 22px;
      z-index: 5;
    }

    .text-counter {
      color: #4063F5;
      font-style: italic;
      font-size: 7px;
      position: absolute;
      bottom: 0;
      right: 35px;
    }

    .el-textarea {
      .el-textarea__inner {
        resize: none;
        border: none;
        background-color: #fff;
        border-radius: 7px;
        padding: 5px 25px 15px 5px;
        font: 11px/16px 'Lato';

        &:focus {
          border-color: transparent;
          background-color: #F2F2F2;
        }

        &:hover {
          background-color: #F2F2F2;
        }
      }
    }

    &:hover {
      .message-delete-button {
        opacity: 1;
      }


    }
  }

  .send-media-preview {
    border-radius: 7px;
    padding-bottom: 80%;
    margin-bottom: 5px;
    background-position: center;
    background-size: cover;
  }

  .send-media-blank {
    border-radius: 7px;
    border: 1px dashed #D8D8D8;
    padding-bottom: 80%;
    margin-bottom: 5px;
    position: relative;
    color: #D8D8D8;

    svg {
      position: absolute;
      top: calc(50% - 47px);
      left: calc(50% - 47px);
    }
  }

  .message-delay-till {
    padding: 10px 10px 10px 20px;
    border: 1px solid #D8D8D8;
    border-radius: 5px;
    background-color: #fff;
    color: #2D2D2D;
    text-align: center;
  }
  .send-media-upload {
    background-color: #51C99E;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    color: #fff;
    text-align: center;
    padding: 8px 0 5px;

    input {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0;
    }
  }

  .unknown-message-wrapper {
    padding: 10px 20px;
    border: 1px dashed #D8D8D8;
    font-size: 16px;
    color: #606266;
    border-radius: 7px;
    background-color: rgba(255, 103, 103, 0.68);
  }

  .message-add-button {
    width: 100%;
    padding: 19px;

    .message-add-event {
      width: 100%;
      height: 50px;
      border: 1px dashed #D8D8D8;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: calc(50% - 1px);
        left: calc(50% - 10px);
        height: 2px;
        background-color: #ccc;
        width: 20px;
      }

      &:before {
        content: '';
        position: absolute;
        top: calc(50% - 10px);
        left: calc(50% - 1px);
        height: 20px;
        background-color: #ccc;
        width: 2px;
      }

      &:hover {
        &:after, &:before {
          background-color: #6A12CB;
        }
      }
    }


  }

  .message-delete-button {
    width: 10px;
    height: 10px;
    color: #b4b4b4;
    position: absolute;
    right: 5px;
    top: 19px;
    opacity: 0;
    cursor: pointer;

    &:hover {
      color: #e74c49;
    }
  }
}
</style>
