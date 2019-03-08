<template>
  <div class="list-conditions" :ref="element.id">
    <div class="condition-item" v-for="item in element.value.conditionList" :key="item.id">
      <div class="remove-item" @click="deleteKeywords(item)">&times</div>
      <message-condition :element="{value: item}">
        <div class="list-condition-container" :ref="item.id">
          <arrow-born :element="item" @connect-arrow="connectArrow(item, $event)"></arrow-born>
        </div>
      </message-condition>
    </div>
    <div class="add-condition" @click="addMessageCondition">+</div>
  </div>
</template>
<script>
import Vue from 'vue'
import messageCondition from './messageCondition.vue'
import arrowBorn from '../arrowBorn.vue'
import ObjectId from '../../utils/ObjectId'

export default {
  props:['element', 'tag'],

  components: {
    messageCondition,
    arrowBorn,
  },

  methods: {
    addMessageCondition() {
      const { element } = this;
      const ObjId = new ObjectId;

      element.value.conditionList.push({
        id: ObjId.toString(),
        keywords: [],
        messageType: 'storyShare',
        link: ''
      })
    },

    deleteMessageCondition(keywords) {
      const { conditionList } = this.element.value;

      conditionList.splice(conditionList.indexOf(keywords), 1)
    },

    connectArrow(item, value) {
      Vue.set(item, 'onMatch', {
        type: 'goToStep',
        id: (new ObjectId).toString(),
        value: {
          stepId: value.child
        }
      })

      this.$store.commit('set', {path: 'arrowConnectData', value: null});
    }
  },

}
</script>
<style lang="scss">
.list-conditions {
  padding: 9px 20px 13px;

  .condition-item {
    position: relative;
    margin-bottom: 10px;

    .keywords {
      position: relative;

      .list-condition-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }

    .message-condition {
      padding: 0;
    }

    .remove-item {
      opacity: 0;
      color: #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      height: 15px;
      width: 15px;
      font-size: 16px;
      position: absolute;
      z-index: 2;
      border-radius: 7px;
      background-color: #fff;
      border: 1px solid #ddd;
      line-height: 10px;
      left: calc(50% - 8px);
      top: -8px;
      cursor: pointer;

      &:hover {
        border-color: #666;
        color: #666;
      }
    }


    &:hover .remove-item{
      opacity: 1;
    }
  }

  .add-condition {
    width: 100%;
    color: #DDDDDD;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    text-align: center;
    line-height: normal;
    font-size: 24px;
  }
}
</style>
