<template>
  <div class="list-conditions" :ref="element.id">
    <div class="condition-item" v-for="item in element.value.conditionList" :key="item.id">
      <div class="remove-item" @click="deleteKeywords(item)">&times</div>
      <message-condition :element="{value: item}"></message-condition>
    </div>
    <div class="add-condition" @click="addMessageCondition">+</div>
  </div>
</template>
<script>
import Vue from 'vue'
import messageCondition from './messageCondition.vue'
import ObjectId from '../../utils/ObjectId'

export default {
  props:['element', 'tag'],

  components: {
    messageCondition
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
    }
  },

}
</script>
<style lang="scss">
.list-conditions {
  padding: 9px 20px 13px;

  .condition-item {
    position: relative;

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
      right: -3px;
      top: -3px;
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
