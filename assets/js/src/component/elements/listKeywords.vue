<template>
  <div class="list-keywords">
    <div class="list-item" v-for="item in element.value">
      <keywords v-model="item.keywords"></keywords>
    </div>
    <div class="add-keywords" @click="addKeywords">+</div>
  </div>
</template>
<script>
import keywords from '../keywords.vue'

export default {
  props:['element'],

  components: {
    keywords
  },

  methods: {
    addKeywords() {
      const { element } = this;

      element.value.push({
        keywords: []
      })
    }
  }
}
</script>
<style lang="scss">
.list-keywords {
  padding: 9px 20px 13px;

  .list-item {
    .keywords {
      width: 100%;
      margin-bottom: 6px;

      .el-input__inner {
        min-height: 47px !important;
      }
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
