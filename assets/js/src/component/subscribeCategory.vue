<template>
<div class="subscribe-category">
  <el-popover v-model="isCategoryList">
    <div class="add-category-area">
      <input v-model="searchCategory" placeholder="Enter category name"/>
      <div class="category-title">Select category to add</div>
      <div class="category-list">
        <div @click="addCategory(category)" class="category-item" v-for="category in categoryList">{{category.name}}</div>
        <div @click="addNewCategory" class="category-item new-category" v-if="searchCategory">{{searchCategory}}</div>
      </div>
    </div>
    <div slot="reference">
      <span class="add-category" v-if="!categories.length">
        Add Subscriber Category
        <img src="../assets/valve.svg"/>
      </span>
      <span class="add-category-more" v-if="categories.length">
        <img src="../assets/valve-white.svg"/>
      </span>
    </div>
  </el-popover>
  <div class="selected-categories">
    <div class="selected-category" v-for="(category, index) in categories">
      {{ category.name }}
      <img src="../assets/times-white.svg" @click="deleteCategory(index)"/>
    </div>
  </div>
</div>    
</template>

<script>
import { Popover } from 'element-ui'

export default {
  data() {
    return {
      searchCategory: '',
      isCategoryList: false, 
    }
  },

  computed: {
    categoryList() {
      const { categories, searchCategory } = this
      return this.$store.state.currentAccount.subscriberCategoryList
        .filter(categoryItem => {
          return categoryItem.name.includes(searchCategory) && !(categories || []).find(category => categoryItem.id == category.id);
        });
    }
  },

  components: {
    'el-popover': Popover
  },

  props: {
    categories: Array
  },

  methods: {
    deleteCategory(categoryIndex) {
      this.categories.splice(categoryIndex, 1);
    },

    addCategory(category) {
      this.categories.push(category);
      this.isCategoryList = false;
      this.searchCategory = ''
    },

    addNewCategory() {
      this.categories.push({ name: this.searchCategory});
      this.isCategoryList = false;
      this.searchCategory = ''
    }
  }
}
</script>

<style lang="scss">

.add-category-area {
  .category-title {
    font-weight: bold;
    margin: 10px 0 5px;
  }

  .category-list {
    .category-item {
      padding: 5px;
      cursor: pointer;
      border-top: 1px solid #e8e4e4;
      cursor: pointer;

      &:last-child {
        border-bottom: 1px solid #e8e4e4;
      }

      &:hover {
        background-color: #E0DFE4;
      }

      &.new-category {
        display: flex;
        justify-content: space-between;

        &:after {
          content: 'new';
          color: rgb(63, 160, 63)
        }
      }
      
    }
  }
}

.subscribe-category {
  display: flex;

  .add-category {
    color: #858099;
    cursor: pointer;

    img {
      opacity: .5;
      width: 20px;
    }
  }

  .selected-categories {
    display: flex;

    .selected-category {
      display: flex;
      padding: 4px 5px 4px 5px;
      background-color: #4DA9FF;
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      border-right: 1px solid #8CBEEE;

      img {
        width: 16px;
        height: 16px;
        margin: 0 0 0 5px !important;
        cursor: pointer;
      }

      &:last-child {
        border-right: none;
        border-radius: 0 24px 24px 0;	
      }
    }
  }

  .add-category-more {
    height: 24px;	
    width: 24px;
    padding-left: 3px;
    border-radius: 24px 0 0 24px;	
    background-color:#3B81C4;
    
    img {
      width: 20px;
    }
  }
}
</style>

