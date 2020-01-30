<template>
  <div class="user-input-items">
    <div class="user-input-select">
      <el-select v-model="inputElement.condition.value" size="small" popper-class="user-input-dropdown" @change="changeSubInput">
        <el-option v-for="inputType in inputList" :key="inputType.value" :value="inputType.value" :label="inputType.title"></el-option>
      </el-select>
    </div>
    <div class="user-input-matches">
      <div class="user-input-match" :ref="element.id">
        Collect
        <add-tag-popup :available-list="builder.availableListByElement(element)" @select="createStep(element, $event)" v-if="!linker"></add-tag-popup>
      </div>
      <div class="user-input-fail" :ref="`${element.id}-fail`">
        Doesn't Collect
        <add-tag-popup :available-list="builder.availableListByElement(element, true)" @select="createStep(element, $event, true)" v-if="!hasOnFail(element)"></add-tag-popup>
      </div>
    </div>
  </div>
</template>

<script>
import elementsPermissions from '../../elements/permissions'
import addTagPopup from '../addTagPopup'
import Vue from 'vue';
import ObjectId from '../../utils/ObjectId';

export default {
  data() {
    return {
      inputList: [{value: '{{email}}', title: 'E-mail'}, {value: '{{phone}}', title: 'Phone'}]
    }
  },

  props: ['elements', 'builder'],

  components: {
    addTagPopup
  },

  computed: {
    element() {
      const element = this.elements[0];

      return element
    },

    inputElement() {
      const { element, builder } = this;

      return builder.getElementByType(element, 'rule')
    },

    linker() {
      const { element, builder } = this;

      return builder.getElementByType(element, 'linker')
    }
  },

  methods: {
    createStep(linkElement, element, isFail) {
      const { linker, builder, element: userInputElement  } = this;

      if (isFail) {
        builder.addStep(linkElement, element, true)
      } else {
         const newLinker = {
          id: (new ObjectId).toString(),
          type: 'linker'
        };

        if (!linker) {
          userInputElement.elements.push(newLinker);
        }

        builder.addStep(linker || newLinker, element);
      }
    },

    hasOnFail(element) {
      return element.elements.find(element => element.type === 'rule').onFail
    },

    changeSubInput(value) {
      const { inputElement, element, builder } = this;
      const action = builder.getElementByType(element, 'action');

      action.body.destination.field = /\{\{(\w*)\}\}/.exec(value)[1];
    }
  }
}
</script>

<style lang="scss">
  .user-input-items {
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    border: 1px solid #D8D8D8;

    .user-input-select {
      padding: 4px 6px;
    }

    .el-select {
      width: 100%;

      .el-select__caret {
        color: #717FFF;
      }

      .el-input__inner {
        background-color: #DBDFFF;
        color: #717FFF;
        border-color: #717FFF
      }
    }

    .user-input-matches {

      & > div {
        padding: 13px 24px;
        text-align: right;
        position: relative;
        font-weight: bold;
      }

      .user-input-fail {
        color: #E06250;
        border-top: 1px dashed #D8D8D8;
      }
    }

    .add-step-button {
      position: absolute;
      right: -14px;
      top: calc(50% - 14px);

      &:after {
        content: '';
        position: absolute;
        top: calc(50% - 1px);
        left: calc(50% - 7px);
        height: 2px;
        background-color: #ccc;
        width: 14px;
      }

      &:before {
        content: '';
        position: absolute;
        top: calc(50% - 7px);
        left: calc(50% - 1px);
        height: 14px;
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

  .user-input-dropdown {
    border: 1px solid #717FFF;
    margin-top: -32px !important;
    overflow: hidden;

    .popper__arrow {
      display: none;
    }

    .el-scrollbar__view {
      padding: 0;
    }

    .el-select-dropdown__item, .el-select-dropdown__item.selected {
      font-size: 13px;
      line-height: 26px;
      color: #2D2D2D;
      padding-top: 4px;
      font-weight: normal;
      background-color: #FFF;

      &:hover {
        background-color: #ECECEC;
      }
    }
  }
</style>