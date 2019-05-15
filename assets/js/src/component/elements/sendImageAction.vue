<template>
  <div class="image-action">
    <div :class="{'image-preview': true, blank: !element.value}" :style="{'background-image': element.value && `url(${ element.value.previewUrl })` }"></div>
    <div class="upload-button">
       <input type="file" accept="image/jpeg,image/png,image/gif" @change="uploadImage"/>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'

export default {
  props:['element'],

  methods: {
    uploadImage() {
      const files = event.target.files;
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('file', file, file.name);
      }

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/file/upload`,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(({ data }) => {
        Vue.set(this.element, 'value', data.response.body);
      });

      event.preventDefault();
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
