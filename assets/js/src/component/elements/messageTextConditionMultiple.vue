<template>
  <div class="list-keywords" :ref="element.id">
    <div class="list-element-item" v-for="(item, index) in element.value.conditionList" :key="item.id" :ref="item.id">
      <div class="remove-item" @click="deleteKeywords(item)">&times</div>
      <arrow-born :element="item" @connect-arrow="connectArrow(item, $event)"></arrow-born>
      <keywords 
        v-model="item.keywords" 
        :tag-prefix="tagPrefix(item, index + 1)" 
        :tag-name="item.name" 
        @set-tag-name="setTagName(item, $event)"
      ></keywords>
    </div>
    <div class="add-keywords" @click="addKeywords" v-if="!hasEmptyItem">+</div>
  </div>
</template>
<script>
import Vue from 'vue'
import keywords from '../keywords.vue'
import arrowBorn from '../arrowBorn.vue'
import ObjectId from '../../utils/ObjectId'

export default {
  props:['element', 'tag'],

  components: {
    keywords,
    arrowBorn
  },

  computed: {
    hasEmptyItem() {
      const { conditionList } = this.element.value;

      return conditionList.some(condition => !condition.keywords.length)
    },
  },

  methods: {
    addKeywords() {
      const { element } = this;
      const ObjId = new ObjectId;

      element.value.conditionList.push({
        id: ObjId.toString(),
        keywords: []
      })
    },

    setTagName(item, value) {
      console.log(item, value);
      
      Vue.set(item, 'name', value)
    }, 

    tagPrefix(item, index){
      const { tag } = this;
      const tagPrefix = `${ tag }_${ index }`

      if (tag && (item.namePrefix != tagPrefix)) {
        Vue.set(item, 'namePrefix', tagPrefix);
      }

      return tag ? item.namePrefix : '';
    },

    deleteKeywords(keywords) {
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
.list-keywords {
  padding: 9px 20px 13px;

  .list-element-item {
    position: relative;

    .keywords {
      width: 100%;
      margin-bottom: 6px;

      .el-input__inner {
        min-height: 47px !important;
      }
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
      right: -3px;
      top: -3px;
      cursor: pointer;

      &:hover {
        border-color: #666;
        color: #666;
      }
    }

    .arrow-born {
      position: absolute;
      z-index: 2;
      right: -7px;
      font-size: 15px;
      top: calc(50% - 11px);

      &:hover {
        border-color: #666;
        color: #666;
      }
    }

    &:hover .remove-item{
      opacity: 1;
    }
  }

  .add-keywords {
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
