<template>
  <div class="video-help w968">
    <div>
      <div class="video-item" v-for="video in videos" :key="video.title">
        <div class="video-title" @click="selected = video">
          <img src="../assets/svg/youtube.svg"/>
          {{ video.title }}
        </div>
        <div class="video-content" v-show="selected === video">
          <iframe width="640" height="564" :src="video.link" frameborder="0" allowFullScreen mozallowfullscreen webkitAllowFullScreen></iframe>
        </div>
      </div>
    </div>
    <div class="video-more">
      More Direct Heroes Training Videos COMING SOON!
    </div>
  </div>  
</template>
<script>
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
   } 
}
</script>
<style lang="scss">
.video-help {
  padding: 30px 0;
  
  .video-item {
    border-top: 1px solid #DBDBDB;

    &:hover {
      background-color: rgba(#6A12CB, .04)
    }

    &:last-child {
      border-bottom: 1px solid #DBDBDB;
    }
  }

  .video-title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    padding: 5px 0;
    cursor: pointer;

    img {
      width: 30px;
      margin-right: 10px;
    }
  }

  .video-content iframe{
    width: 100%;
  }  

  .video-more {
    margin-top: 20px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
