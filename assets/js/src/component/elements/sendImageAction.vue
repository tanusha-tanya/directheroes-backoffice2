<template>
  <div class="image-action">
    <div :class="{'image-preview': true, blank: !element.value}" :style="{'background-image': element.value && `url(${ element.value.previewUrl })` }"></div>
    <div class="upload-button">
       <input type="file" @change="uploadImage"/>
    </div>
  </div>
</template>
<script>
export default {
  props:['element'],

  methods: {
    uploadImage() {

    }
  }
}
</script>
<style lang="scss">
.image-action {
  .image-preview {
    height: 120px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

    &.blank {
      background-image: url(../../assets/svg/image-placeholder.svg);
      background-size: auto;
    }
  }

  .upload-button {
    position: relative;
    overflow: hidden;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(../../assets/svg/upload.svg);
    background-color: #F3F3F3;
    border-top: 1px solid #DDDDDD;
    background-size: 8%;
    border-radius: 0 0 4px 4px;
    height: 32px;
    cursor: pointer;

    & > input {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
}
</style>
