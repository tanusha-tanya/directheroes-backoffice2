<template>
  <div class="dh-view dh-training-view">
    <dh-header title="Training"></dh-header>
    <div class="dh-view-content">
      <div class="dh-list">
        <a href="https://youtu.be/SZ9jDL461X4" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Connecting Your Instagram Account
        </a>
        <a href="https://youtu.be/wHC9iHry90M" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Dashboard Walkthrough
        </a>
        <a href="https://youtu.be/krcIYhdnh5U" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Audience Walkthrough
        </a>
        <a href="https://youtu.be/9dIw1W7YwR4" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Live Chat Walkthrough
        </a>
        <a href="https://youtu.be/QnmqZVi137U" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Broadcast Walkthrough
        </a>
        <a href="https://youtu.be/XzHQBkIAR4Y" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Partner Program WalkThrough
        </a>
        <el-collapse v-model="activeItem" accordion>
          <el-collapse-item title="Campaigns" name="1">
            <a href="https://youtu.be/IlDvH6oOIXI" target="_blank" class="dh-list-item">
              <span><tutorials/></span>
              Opt in Triggers
            </a>
            <a href="https://youtu.be/Agpmo_L3i5w" target="_blank" class="dh-list-item">
              <span><tutorials/></span>
              Action Tags
            </a>
            <a href="https://youtu.be/S9lS7uKLOgI" target="_blank" class="dh-list-item">
              <span><tutorials/></span>
              Mid Campaign Triggers
            </a>
            <a href="https://youtu.be/ArJ_jjYRYm8" target="_blank" class="dh-list-item">
              <span><tutorials/></span>
              Conditions
            </a>
            <a href="https://youtu.be/PVde0y3rFcs" target="_blank" class="dh-list-item">
              <span><tutorials/></span>
              Existing Steps
            </a>
          </el-collapse-item>
          <el-collapse-item title="Trainings" name="2">
            <a href="https://youtu.be/M547brjtorQ" target="_blank" class="dh-list-item">
              <span><tutorials/></span>
              Growing Your Instagram List Free
            </a>
            <a href="https://youtu.be/spljZBHpijE" target="_blank" class="dh-list-item">
              <span><tutorials/></span>
              Top Instagram Giveaway Campaign! 80% email open rate!!!
            </a>
          </el-collapse-item>
          <el-collapse-item title="Documents" name="3">
            <a href="https://www.directheroes.com/doc-dist/Build_Your_First_Flow.pdf" download target=_blank class="dh-list-item">
              Build Your First Flow
            </a>
            <a href="https://www.directheroes.com/doc-dist/2_Min_Template.pdf" download target=_blank class="dh-list-item">
              Two Minute Template
            </a>
            <a href="https://www.directheroes.com/doc-dist/30_Day_Customer_Walk_Through.pdf" download target=_blank class="dh-list-item">
              30 Customer Walk Through
            </a>
            <a href="https://www.directheroes.com/doc-dist/Integrate_With_Zapier.pdf" download target=_blank class="dh-list-item">
              How to Integrate With Zapier
            </a>
          </el-collapse-item>
        </el-collapse>

        <a href="https://www.youtube.com/channel/UCNzmh2GxbrgkVes0yJNbKWQ" target="_blank" class="dh-button">
          Subscribe to YouTube
        </a>
        <!-- <a href="https://youtu.be/spljZBHpijE" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Top Instagram Giveaway Campaign! 80% email open rate!!!
        </a>
        <a href="https://youtu.be/M547brjtorQ" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Growing Your Instagram List Free
        </a>
        <a href="https://www.directheroes.com/doc-dist/Build_Your_First_Flow.pdf" download target=_blank class="dh-list-item">Build Your First Flow</a>
        <a href="https://www.directheroes.com/doc-dist/2_Min_Template.pdf" download target=_blank class="dh-list-item">Two Minute Template</a>
        <a href="https://www.directheroes.com/doc-dist/30_Day_Customer_Walk_Through.pdf" download target=_blank class="dh-list-item">30 Customer Walk Through </a>
        <a href="https://www.directheroes.com/doc-dist/Integrate_With_Zapier.pdf" download target=_blank class="dh-list-item">How to Integrate With Zapier</a>
        <a href="https://www.youtube.com/channel/UCNzmh2GxbrgkVes0yJNbKWQ" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Direct Heroes YouTube Channel
        </a> -->
      </div>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import tutorials from '../assets/tutorials.svg'

export default {
  data() {
    return {
      activeItem:[]
    }
  },

  components: {
    dhHeader,
    dhFooter,
    tutorials,
  },
};
</script>

<style lang="scss">
.dh-training-view {
  width: 100%;

  .dh-view-content {
    display: flex;
  }

  .dh-button {
    font: 500 14px Rubik;
    line-height: 17px;
    height: 46px;
    min-width: 200px;
    padding: 15px 15px 14px;
    text-transform: uppercase;
    border-radius: 4px;
    outline: none;
    background-color: #9E4CF9;
    border: 1px solid #9E4CF9;
    color: #fff;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    display: block;
    margin-top: 15px;
  }

  .dh-list {
    width: 100%;
  }

  .dh-list-item span{
    color: #778CA2;
    margin-right: 15px;
  }

  .el-collapse-item {
    .el-collapse-item__header {
      padding: 15px 20px;
      text-transform: uppercase;
      color: #778CA2;
      font-size: 16px;

      &:hover {
        color: $elementActiveColor;
      }
    }

    .el-collapse-item__content {
      padding: 10px 0 10px 25px;
    }
  }
}
</style>
