<template>
  <div id="app">
    <dh-header></dh-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './sections/header.vue'

export default {
  name: 'app',

  components: {
    'dh-header': Header
  }
}
</script>

<style lang="scss">
  .container {
    min-height: calc(100% - 50px);
    display: flex;
    color: #0C0033;
  }

  .sidebar {
    max-width: 250px;
    width: 100%;
    flex-shrink: 0;
    background-color: #EEEEEE;
  }

  .pre-loader {
    height: 50px;
    width: 50px;
    position: relative;

    &:before, &:after {
      animation: 1.6s linear 0s normal none infinite running preloader-wave;
      background: #434890 none repeat scroll 0 0;
      border-radius: 100%;
      content: "";
      height: 50px;
      position: absolute;
      width: 50px;
    }

    &:after {
      animation-delay: -0.8s;
    }
  }

  .loading-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .message-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 32px;
    font-weight: bold;
  }

  .error-message {
    color: #ff0048;
    font-size: 12px;
    line-height: 16px;
    display: flex;
    align-items: center;

    &:before {
      content: '';
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 5px;
      background: url(./assets/triangle-error.svg) no-repeat;
    }
  }

  .success-message {
    color: #67c23a;
    font-weight: 600;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
  }

  button {
    background-color: #434890;
    border: none;
    outline: none;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    padding: 8px 26px;
    color: #fff;
    cursor: pointer;

    &:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    &.loading {
      color: transparent;
      position: relative;

      &:before {
        content: '';
        display: block;
        position: absolute;
        top: calc(50% - 10px);
        left: calc(50% - 10px);
        width: 15px;
        height: 15px;
        border-radius: 100%;
        border: 3px solid #FFF;
        border-bottom-color: transparent;
        animation: rotation  .8s infinite linear;
      }
    }
  }

  label {
    display: block;
    color: #858099;
    font-size: 12px;
    line-height: 16px;
  }

  .content {
    flex-grow: 1;
    position: relative;
  }

  .content-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 17px;
    background-color: #EEEEEE;
  }

  .content-controls {
    display: flex;
  }

  .content-button {
    display: flex;
    align-items: center;
    color: #85539C;
    white-space: nowrap;
    margin: 0 15px;
    cursor: pointer;
    opacity: .5;

    & {
      opacity: 1
    }

    &.not-active {
      opacity: .5;

      &:hover {
        opacity: .8;
      }
    }

    img {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;

    img {
      width: 16px;
      height: 16px;
    }

    div {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
    }
  }

  // .el-switch {
  //   display: inline-flex;
  //   align-items: center;
  //   position: relative;
  //   font-size: 14px;
  //   line-height: 20px;
  //   height: 20px;
  //   vertical-align: middle;

  //   .el-switch__input {
  //     position: absolute;
  //     width: 0;
  //     height: 0;
  //     opacity: 0;
  //     margin: 0;
  //   }

  //   &.is-checked .el-switch__core {
  //     &:after {
  //       left: 100%;
  //       margin-left: -14px;
  //     }
  //   }

  //   .el-switch__core {
  //     margin: 0;
  //     display: inline-block;
  //     position: relative;
  //     width: 40px;
  //     height: 20px;
  //     border: 3px solid #85539C;
  //     outline: none;
  //     border-radius: 10px;
  //     cursor: pointer;
  //     vertical-align: middle;

  //     &:after {
  //       content: "";
  //       position: absolute;
  //       top: 1px;
  //       left: 2px;
  //       border-radius: 100%;
  //       transition: all .3s;
  //       width: 12px;
  //       height: 12px;
  //       background-color: #85539C;
  //     }
  //   }
  // }

  .scroller {
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-button {
      width: 0px;
      height: 0px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #d2d2d2;
      border: 0px none #ffffff;
      border-radius: 50px;
      transition: .2s background-color
    }

    &::-webkit-scrollbar-thumb:hover, &::-webkit-scrollbar-thumb:active {
      background-color: #a4a4a4;
    }

    &::-webkit-scrollbar-track {
      background-color: #f8f8f8;
      border: 0px none #ffffff;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-track:hover, &::-webkit-scrollbar-track:active {
      background: #ffffff;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }

  // .el-select-dropdown {
  //   display: none;
  // }

  // .v-modal {
  //   position: fixed;
  //   left: 0;
  //   top: 0;
  //   width: 100%;
  //   height: 100%;
  //   opacity: .5;
  //   background: #000;
  // }

  // .el-dialog__wrapper {
  //   position: fixed;
  //   top: 0;
  //   right: 0;
  //   bottom: 0;
  //   left: 0;
  //   overflow: auto;
  //   margin: 0;
  // }

  // .el-dialog {
  //   position: relative;
  //   margin: 0 auto 50px;
  //   background: #fff;
  //   border-radius: 2px;
  //   box-shadow: 0 1px 3px rgba(0,0,0,.3);
  //   box-sizing: border-box;
  //   width: 708px;
  //   padding: 24px;
  //   border-radius: 10px;
  //   font-size: 14px;
  //   line-height: 20px;

  //   .el-input {
  //     border: 1px solid #0C0033;
  //     border-radius: 7px;

  //     input {
  //       padding: 14px 16px 13px;
  //       font-size: 16px;
  //       line-height: 24px;
  //       border: none;
  //       width: 100%;
  //       outline: none;
  //       background-color: transparent;
  //     }
  //   }

  //   .el-dialog__header {
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //   }

  //   .dialog-description {
  //     text-align: center;
  //     margin-top: 8px;
  //   }

  //   .el-dialog__title {
  //     font-size: 20px;
  //     font-weight: 600;
  //     line-height: 32px;
  //     flex-grow: 1;
  //     text-align: center;
  //   }

  //   .el-dialog__headerbtn {
  //     border: none;
  //     background: none;
  //     padding: 0;
  //   }

  //   .el-dialog__close {
  //     display: block;
  //     width: 24px;
  //     height: 24px;
  //     background-image: url(./assets/times.svg);
  //     cursor: pointer;
  //   }

  //   .el-dialog__footer {
  //     display: flex;
  //     justify-content: flex-end;
  //     margin-top: 25px;
  //   }
  // }

  // .dialog-buttons {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   margin-top: 35px;

  //   .cancel-button {
  //     background: none;
  //     padding: 0;
  //     color: #0C0033;
  //     font-weight: normal;
  //   }
  // }

  // .el-checkbox {
  //   font-size: 12px;
  //   cursor: pointer;
  //   white-space: nowrap;
  //   user-select: none;

  //   .el-checkbox__input {
  //     white-space: nowrap;
  //     cursor: pointer;
  //     outline: none;
  //     display: inline-block;
  //     line-height: 1;
  //     position: relative;
  //     vertical-align: middle;

  //     &.is-checked {
  //       .el-checkbox__inner {
  //         background-color: #434890;
  //         &:after {
  //           transform: rotate(45deg) scaleY(1);
  //         }
  //       }
  //     }
  //   }

  //   .el-checkbox__original {
  //     opacity: 0;
  //     outline: none;
  //     position: absolute;
  //     margin: 0;
  //     width: 0;
  //     height: 0;
  //     z-index: -1;
  //   }

  //   .el-checkbox__inner {
  //     display: inline-block;
  //     position: relative;
  //     border: 1px solid #434890;
  //     border-radius: 2px;
  //     box-sizing: border-box;
  //     width: 20px;
  //     height: 20px;
  //     background-color: #fff;
  //     z-index: 1;
  //     transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);

  //     &:after {
  //       content: "";
  //       border: 2px solid #fff;
  //       border-left: 0;
  //       border-top: 0;
  //       height: 11px;
  //       left: 6px;
  //       position: absolute;
  //       top: 0;
  //       transform: rotate(45deg) scaleY(0);
  //       width: 5px;
  //       transition: transform .15s ease-in .05s;
  //       transform-origin: center;
  //     }
  //   }

  //   .el-checkbox__label {
  //     margin-left: 10px;
  //   }
  // }

  // .el-message {
  //   border-radius: 4px;
  //   overflow: hidden;
  //   min-width: 380px;
  //   border-width: 1px;
  //   border-style: solid;
  //   border-color: #ebeef5;
  //   position: fixed;
  //   left: 50%;
  //   top: 20px;
  //   transform: translateX(-50%);
  //   background-color: #edf2fc;
  //   transition: opacity .3s,transform .4s;
  //   padding: 15px 15px 15px 20px;
  //   display: flex;
  //   align-items: center;
  //   font: 600 16px sans-serif;

  //   p {
  //      margin: 0;
  //   }

  //   &.el-message--success {
  //     background-color: rgba(#f0f9eb, .95);
  //     border-color: #e1f3d8;

  //     .el-message__content {
  //       color: #67c23a;
  //     }
  //   }

  //   &.el-message--error {
  //     background-color: rgba(#f0f9eb, .95);
  //     border-color: #fde2e2;

  //     .el-message__content {
  //       color: #f56c6c;
  //     }
  //   }

  //   .el-message__content {
  //     padding: 0;
  //     line-height: 1;
  //     text-align: center;
  //   }
  // }

  // .el-radio {
  //   color: #606266;
  //   cursor: pointer;
  //   display: inline-block;
  //   white-space: nowrap;
  //   outline: none;
  //   display: inline-flex;
  //   align-items: center;

  //   .el-radio__input {
  //     color: #606266;
  //     cursor: pointer;
  //     display: inline-block;
  //     white-space: nowrap;
  //     outline: none;
      
  //     &.is-checked {
  //       .el-radio__inner {
  //         border-color: #434890;
  //         background: #434890;

  //         &:after {
  //           transform: translate(-50%,-50%) scale(1);
  //         }
  //       }

  //       & +.el-radio__label {
  //         color: #434890;
  //       }
  //     }
  //   }

  //   .el-radio__inner {
  //     border: 1px solid #dcdfe6;
  //     border-radius: 100%;
  //     width: 20px;
  //     height: 20px;
  //     background-color: #fff;
  //     position: relative;
  //     cursor: pointer;
  //     display: flex;

  //     &:after {
  //       width: 8px;
  //       height: 8px;
  //       border-radius: 100%;
  //       background-color: #fff;
  //       content: "";
  //       position: absolute;
  //       left: 50%;
  //       top: 50%;
  //       transform: translate(-50%,-50%) scale(0);
  //       transition: transform .15s ease-in;
  //     }
  //   }

  //   .el-radio__original {
  //     opacity: 0;
  //     outline: none;
  //     position: absolute;
  //     z-index: -1;
  //     top: 0;
  //     left: 0;
  //     right: 0;
  //     bottom: 0;
  //     margin: 0;
  //   }

  //   .el-radio__label {
  //     font-size: 14px;
  //     margin-left: 10px;
  //   }
  // }

  // .el-dropdown-menu {
  //   padding: 10px;
  // }
</style>
