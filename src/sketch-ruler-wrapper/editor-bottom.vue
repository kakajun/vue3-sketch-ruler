<template>
  <div class="editor-bottom">
    <div class="eui-editor-tool-bar">
      <div
        class="eui-editor-tool-bar-btns eui-buttons-bar"
        style="justify-content: left"
        :style="toolStyle"
      >
        <svg-icon icon-class="dashboard" class="dashboard" />
        <!-- <button
          type="button"
          class="eui-button eui-editor-tool-bar-btn eui-button--normal--clear eui-button__icon--only eui-button--middle"
        >
          <div class="eui-button__container">
            <svg width="1em" height="1em" class="eui-icon #eui-icon--window">
              <use xlink:href="#eui-icon--window"></use>
            </svg>
          </div>
        </button>
        <div class="eui-buttons-bar__divide"></div>
        <div
          type=""
          class="eui-button eui-editor-tool-bar-btn eui-button--normal--clear eui-button__icon--only eui-button--middle"
          style="margin-right: 0px"
        >
          <div class="eui-button__container">
            <svg width="1em" height="1em" class="eui-icon #eui-icon--zoomout">
              <use xlink:href="#eui-icon--zoomout"></use>
            </svg>
          </div>
        </div>
        <div
          type=""
          class="eui-button eui-editor-tool-bar-btn eui-button--normal--clear eui-button__icon--only eui-button--middle"
        >
          <div class="eui-button__container">
            <svg width="1em" height="1em" class="eui-icon #eui-icon--zoomin">
              <use xlink:href="#eui-icon--zoomin"></use>
            </svg>
          </div>
        </div>
        <button
          type="button"
          class="eui-button eui-editor-tool-bar-btn eui-editor-tool-bar__zoom-button eui-button--normal--clear eui-button__icon--only eui-button--middle"
        >
          <div class="eui-button__container">
            <svg
              width="1em"
              height="1em"
              class="eui-icon #eui-icon--zoom-actual-size"
            >
              <use xlink:href="#eui-icon--zoom-actual-size"></use>
            </svg>
            37%
          </div>
        </button>-->
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from './svg-icon.vue'
export default {
  name: '',
  components: { SvgIcon },
  data() {
    return {
      toolOpen: true
    }
  },
  computed: {
    toolStyle() {
      return { width: this.toolOpen ? '158px' : '60px' }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard {
  font-size: 20px;
  // color: red;
}
.editor-bottom {
  display: flex;
  position: absolute;
  bottom: 26px;
  right: 24px;
  z-index: 2;
}
.eui-editor-tool-bar {
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  color: #636c78;
  box-sizing: border-box;
}
.eui-buttons-bar {
  // background: #000;
  height: 40px;
  padding: 6px 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  // background: rgba(238, 242, 248, 0.9);
  border-radius: 4px;
  flex-direction: row;
  font-size: 12px;
  line-height: 17px;
  position: relative;
}
.eui-editor-tool-bar-btns {
  transition: all 0.2s;
  overflow: hidden;
  justify-content: flex-end !important;
}
.eui-button {
  padding: 4px;
  margin-right: 5px;
  border: none;
}
</style>
