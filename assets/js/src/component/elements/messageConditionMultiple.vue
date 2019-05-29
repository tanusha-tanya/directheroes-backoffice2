<template>
  <div class="list-conditions" :ref="element.id">
    <div class="condition-item" v-for="(item, index) in element.value.conditionList" :key="item.id">
      <div class="remove-item" @click="triggerToDelete = item" >&times</div>
      <message-condition
        :element="{value: item}"
        :hide-select="notAnyFirst(item, index)"
        :can-has-any="canHasAny(item, index)"
        :tag-prefix="tagPrefix(item)"
        :tag-name="item.name"
        :triggers="triggers"
        :list-name="listName"
        @set-tag-name="setTagName(item, $event)"
        >
        <element-warning :element="Object.assign({}, item, { emptyMoreOne })"></element-warning>
        <div class="list-condition-container" :ref="item.id">
          <arrow-born :class="{'no-connection': !item.onMatch }" :element="item" @connect-arrow="connectArrow(item, $event)"></arrow-born>
        </div>
      </message-condition>
      <div class="add-list" @click="addListCondition(index)" v-if="isLastAny(item, index) && ! hasEmptyList">+ {{ listName ? 'Click to add list item' : 'Click to add Keywords group' }}</div>
    </div>
    <div class="add-condition" @click="addMessageCondition(null)">+ {{ !listName ? 'Click to add Growth Tool' : 'Click to add trigger'}}</div>
    <confirm-dialog
        v-model="toDeleteTrigger"
        title="Delete trigger"
        message="Are you sure you want to delete trugger?"
        @success="deleteMessageCondition"
        >
      </confirm-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import messageCondition from './messageCondition.vue'
import arrowBorn from '../arrowBorn.vue'
import elementWarning from '../elementWarning.vue'
import ObjectId from '../../utils/ObjectId'
import confirmDialog from '../confirmDialog.vue'

export default {
  data() {
    return {
      triggerToDelete: null,
    }
  },

  props:['element', 'tag', 'triggers', 'listName'],

  computed: {
    anyItems() {
      return this.element.value.conditionList.filter(item => item.messageType === 'any')
    },

    hasAny() {
      return Boolean(this.anyItems.length)
    },

    hasEmptyList() {
      return this.anyItems.some(item => !item.keywords.length)
    },

    emptyMoreOne() {
      return this.anyItems.filter(item => !item.keywords.length).length > 1;
    },

    toDeleteTrigger: {
      get() {
        return Boolean(this.triggerToDelete)
      },

      set(value) {
        this.triggerToDelete = value;
      }
    }
  },

  components: {
    messageCondition,
    arrowBorn,
    elementWarning,
    confirmDialog,
  },

  methods: {
    addListCondition(index) {
      const { element, hasAny } = this;
      const ObjId = new ObjectId;

      element.value.conditionList.splice(index + 1, 0, {
        id: ObjId.toString(),
        keywords: [],
        messageType: 'any',
        link: ''
      })
    },

    addMessageCondition() {
      const { element, hasAny, triggers } = this;
      const ObjId = new ObjectId;

      element.value.conditionList.push({
        id: ObjId.toString(),
        keywords: [],
        messageType: hasAny ? triggers.find(trigger => trigger !== 'any') : 'any',
        link: ''
      })
    },

    deleteMessageCondition() {
      const { conditionList } = this.element.value;

      conditionList.splice(conditionList.indexOf(this.triggerToDelete), 1);
      this.toDeleteTrigger = null;
    },

    notAnyFirst(item, index) {
      const { conditionList } =  this.element.value;
      const prevCondition = conditionList[index - 1];

      return prevCondition && prevCondition.messageType === 'any' && item.messageType === 'any';
    },

    isLastAny(item, index) {
      const { conditionList } =  this.element.value;
      const nextCondition = conditionList[index + 1];

      return item.messageType === 'any' && (!nextCondition || nextCondition.messageType !== 'any');
    },

    canHasAny(item, index) {
      const { hasAny } = this;
      const { conditionList } =  this.element.value;
      const nextCondition = conditionList[index + 1];
      const prevCondition = conditionList[index - 1];

      return !hasAny || item.messageType === 'any' || (prevCondition && prevCondition.messageType === 'any') || (nextCondition && nextCondition.messageType === 'any')
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
    },

    setTagName(item, value) {
      Vue.set(item, 'name', value)
    },

    tagPrefix(item){
      const index = this.element.value.conditionList.indexOf(item);
      // const index = this.anyItems.indexOf(item)
      const { tag } = this;
      const tagPrefix = `${ tag }_${ index + 1 }`

      // if (item.messageType !== 'any') return;

      if (typeof tag == 'number' && (item.namePrefix != tagPrefix)) {
        Vue.set(item, 'namePrefix', tagPrefix);
      }

      return typeof tag == 'number' ? item.namePrefix : '';
    },
  },

}
</script>
<style lang="scss">
@keyframes scale-element-1-2 {
  from {transform: scale(1)}
  50% {transform: scale(1.2)}
  to {transform: scale(1)}
}

.list-conditions {
  padding: 9px 20px 13px;

  .condition-item {
    position: relative;
    margin-bottom: 10px;

    .keywords {
      position: relative;

      .el-select {
        z-index: 5;
        width: 100%;
      }

      .list-condition-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .arrow-born.no-connection {
        background-color: #ff4d4d;
        border-color: #ff4d4d;
        animation: scale-element-1-2 1s infinite;
      }

      .element-warning {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 10;
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
      z-index: 10;
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

  .add-list {
    margin-top: 5px;
  }

  .add-condition, .add-list {
    width: 100%;
    color: #DDDDDD;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    text-align: center;
    line-height: normal;
    font-size: 16px;
    padding: 6px;
  }
}
</style>
