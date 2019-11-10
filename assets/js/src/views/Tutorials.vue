<template>
  <div class="dh-view dh-tutorials-view">
    <dh-header title="Tutorials"></dh-header>
    <div class="dh-view-content">
      <div class="dh-tutorials">
        <div class="dh-tutorials-list">
          <div class="dh-tutorial" v-for="(tutorial, index) in videos" :key="index" @click="selected = tutorial">
            <div class="dh-tutorial-index">Lesson {{index + 1}}</div>
            <div class="dh-tutorial-name">{{tutorial.title}}</div>
          </div>
        </div>
        <div class="dh-tutorial-view" v-if="selected">
          <div class="dh-tutorial-index">Lesson {{videos.indexOf(selected) + 1}}</div>
          <div class="dh-tutorial-name">{{selected.title}}</div>
          <div class="dh-tutorial-video" v-if="selected">
            <iframe width="640" height="564" :src="selected.link" frameborder="0" allowFullScreen mozallowfullscreen webkitAllowFullScreen></iframe>
          </div>
        </div>
      </div>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'

export default {
  data() {
    return {
      selected: null,
      videos: [
      {
        title: 'Introduction and Why Your Business Needs Instagram',
        link: 'https://player.vimeo.com/video/310986137'
      },
      {
        title: 'Setup Profile for Follower Conversions',
        link: 'https://player.vimeo.com/video/311014012'
      },
      {
        title: 'Posting for Maximum Exposure',
        link: 'https://player.vimeo.com/video/311014120'
      },
      {
        title: 'Using IGTV Correctly',
        link: 'https://player.vimeo.com/video/310986209'
      },
      {
        title: 'Using Stories Effectively',
        link: 'https://player.vimeo.com/video/310986212'
      },
      {
        title: 'How Hashtags Work',
        link: 'https://player.vimeo.com/video/310986118'
      },
      {
        title: 'Hashtag Research',
        link: 'https://player.vimeo.com/video/310986106'
      },
      {
        title: 'Golden Growth Rule',
        link: 'https://player.vimeo.com/video/310986185'
      },
      {
        title: '$1.80 Strategy',
        link: 'https://player.vimeo.com/video/310986082'
      },
      {
        title: 'Setting Up Instagram Ads',
        link: 'https://player.vimeo.com/video/310986168'
      },
      {
        title: 'Auto Selling with Pinned Stories',
        link: 'https://player.vimeo.com/video/310986093'
      },
      {
        title: 'Tracking Clicks',
        link: 'https://player.vimeo.com/video/310986202'
      },
      {
        title: 'Leadsheet Strategy',
        link: 'https://player.vimeo.com/video/310986149'
      },
      {
        title: 'Influencer Shoutouts For Traffic & Growth',
        link: 'https://player.vimeo.com/video/310986130'
      },
      {
        title: 'How to Find Influencers',
        link: 'https://player.vimeo.com/video/310986101'
      },

      ]
    }
  },

  components: {
    dhHeader,
    dhFooter,
  },
};
</script>

<style lang="scss">
.dh-tutorials-view {
  .dh-view-content {
    display: flex;
  }

  .dh-tutorials {
    width: 100%;
    background-color: $sectionBG;
    border-radius: 4px;
    display: flex;
    flex-grow: 1;
    max-height: calc(100vh - 173px);
  }

  .dh-tutorials-list {
    border-right: 1px solid $secondBorderColor;
    width: 262px;
    flex-shrink: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .dh-tutorial-view {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .dh-tutorial {
    height: 88px;
    padding: 20px;
    cursor: pointer;
    border-bottom: 1px solid #F2F4F6;
  }

  .dh-tutorial-index {
    color: $textColor;
    font-size: 12;
    line-height: 18px;
  }

  .dh-tutorial-name {
    font-weight: 500;
    line-height: 18px;
  }

  .dh-tutorial-view {
    flex-grow: 1;
    padding: 34px 34px 34px 97px;

    .dh-tutorial-index {
      font-size: 18px;
    }

    .dh-tutorial-name {
      font-size: 24px;
      margin: 15px 0;
    }
  }

  .dh-tutorial-video {
  }
}
</style>