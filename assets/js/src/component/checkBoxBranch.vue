<template>
  <div class="checkbox-branch">
    <div class="checkbox-branch-item">
      <div class="checkbox-branch-toggler" @click="collapsed = !collapsed">{{collapsed ? '+' : '-'}}</div>
      <el-checkbox v-if="typeof item.subscribersCount !== 'undefined'" :checked="Boolean(isChecked(item.id))" @change="checkHandler(item)"></el-checkbox>
      {{ item.name }} <span v-if="typeof item.subscribersCount !== 'undefined'">[{{ item.subscribersCount }} subscribers]</span>
    </div>
    <div class="checkbox-branch-list" v-if="!collapsed && item.list && item.list.length">
      <div class="checkbox-branch-kidney" v-for="listItem in item.list" :key="listItem.id">
        <el-checkbox :checked="Boolean(isChecked(listItem.id))" @change="checkHandler(listItem)"></el-checkbox>
        {{ listItem.name }} <span v-if="typeof listItem.subscribersCount !== 'undefined'">[{{ listItem.subscribersCount }} subscribers]</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false
    }
  },

  props: ['item', 'checkedList'],

  methods: {
    isChecked(itemId) {
      const { checkedList } = this;

      return checkedList.find(checkedItem => checkedItem.id == itemId);
    },

    checkHandler(item) {
      const { checkedList, isChecked } = this;
      const checkedItem = isChecked(item.id);

      if (checkedItem) {
        checkedList.splice(checkedList.indexOf(checkedItem), 1)
      } else {
        const newItem = {...item};

        delete newItem.list;

        checkedList.push(newItem);
      }
    }
  }
}
</script>

<style lang="scss">
  .checkbox-branch {
    .checkbox-branch-item {
      display: flex;
      white-space: nowrap;

      .checkbox-branch-toggler {
        font-weight: bold;
        font-size: 16px;
        width: 14px;
        margin-right: 3px;
        cursor: pointer;
        text-align: center;
      }

      & > span {
        margin-left: 5px;
      }
    }

    .checkbox-branch-list {
      padding-left: 20px;
    }

    .checkbox-branch-kidney {
      display: flex;
      white-space: nowrap;

      & > span {
        margin-left: 5px;
      }
    }

    .el-checkbox {
      margin-right: 5px;
    }
  }
</style>
