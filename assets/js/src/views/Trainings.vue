<template>
  <div class="dh-view dh-training-view">
    <dh-header title="Training"></dh-header>
    <div class="dh-view-content">
      <div class="dh-list">
        <a href="https://youtu.be/SZ9jDL461X4" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Connecting Your Instagram Account
        </a>
        <a href="https://www.directheroes.com/doc-dist/Build_Your_First_Flow.pdf" download target=_blank class="dh-list-item">Build Your First Flow</a>
        <a href="https://www.directheroes.com/doc-dist/Integrate_With_Zapier.pdf" download target=_blank class="dh-list-item">How to Integrate With Zapier</a>
        <a href="https://www.youtube.com/channel/UCNzmh2GxbrgkVes0yJNbKWQ" target="_blank" class="dh-list-item">
          <span><tutorials/></span>
          Direct Heroes YouTube Channel
        </a>
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

  .dh-list {
    width: 100%;
  }

  .dh-list-item span{
    color: #778CA2;
    margin-right: 15px;
  }
}
</style>