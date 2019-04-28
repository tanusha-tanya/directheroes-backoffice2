<template>
  <div class="book-help w968">
    <div>
      <div class="book-item" v-for="book in books" :key="book.title">
        <div class="book-title">
          <img src="../assets/svg/pdf.svg"/>
          <a :href="book.link" target="_blank">{{ book.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
   data() {
     return {
      books: [
        {
          title: 'Connecting Your Instagram Account To Direct Heroes',
          link: 'https://www.directheroes.com/doc-dist/Connecting_Your_Instagram_Account_To_Direct_Heroes.pdf'
        },
        {
          title: 'Building Your First Direct Heroes Flow',
          link: 'https://www.directheroes.com/doc-dist/Building_Your_First_Direct_Heroes_Flow1.pdf'
        },
        {
          title: '30 Day Customer Walk Through',
          link: 'https://www.directheroes.com/doc-dist/30_Day_Customer_Walk_Through.pdf'
        },
        {
          title: '2 Min Template',
          link: 'https://www.directheroes.com/doc-dist/2_Min_Template.pdf'
        },
       ]
     }
   }
}
</script>
<style lang="scss">
.book-help {
  padding: 30px 0;

  .book-item {
    border-top: 1px solid #DBDBDB;

    &:hover {
      background-color: rgba(#6A12CB, .04)
    }

    &:last-child {
      border-bottom: 1px solid #DBDBDB;
    }
  }

  .book-title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    padding: 5px 0;
    cursor: pointer;

    a {
      color: inherit;
      text-decoration: none;
    }

    img {
      width: 30px;
      margin-right: 10px;
    }
  }
}
</style>
