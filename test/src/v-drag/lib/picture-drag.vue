<template>
<div class="hui-picture-dragger_outter" :style="'width:' + img.imgWidth + 'px;'"
  @mouseup="handleMouseUp($event)"
  @mousemove="handleMouseMove($event)">
  <img :src="img.src" :alt="img.alt" class="hui-background" :style="'height:' + img.imgHeight + 'px;width:' + img.imgWidth + 'px;'" />
  <!-- title -->
  <span v-if="title" class="hui-picture-dragger_title">
      {{ title }}
    </span>
  <slot v-else name="title">
  </slot>

  <div class="hui-picture-dragger-dimension_outter" v-if="dimensionVisible">
    <span v-for="item in dimension" class="hui-picture-dragger-dimension" :key="item.key" :style="{ backgroundColor: item.color }">
        {{ item.name }}
      </span>
  </div>
  <slot v-else name="dimension">
  </slot>

  <span v-for="(mark, index) in markList" @mousedown.left="handleMouseDown($event, mark, index)"
    @mouseover="handleMouseOver($event, mark, index)"
    :key="mark.id" :style="{ left:mark.left+'px', top:mark.top+'px', zIndex: mark.zIndex }" :ref="'mark' + index" draggable="true"
    class="hui-picture-dragger_mark">
      <div :class="[{ 'hui-picture-dragger_mark-content__dragging' : dragging && index === status.index }, 'hui-picture-dragger_mark-content']"
        :style="{ backgroundColor: mark.focus? '#F14835': getItem('key', mark.dimension, dimension).color }">
          {{ mark.name }}
      </div>
      <div :class="[{ 'hui-picture-dragger_mark-content__dragging' : dragging && index === status.index }, 'hui-picture-dragger_mark-triangle']"
        :style="{ backgroundColor: mark.focus? '#F14835': getItem('key', mark.dimension, dimension).color }">
      </div>
  </span>
</div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    img: {
      type: Object,
      required: true,
    },
    // [{ name, key, color }]
    dimension: {
      type: Array,
      required: true,
    },
    dimensionVisible: {
      type: Boolean,
      default: true,
    },
    // [{ name, dimension, id, left, top, index }]
    marks: {
      type: Array,
      default: [],
    },
  },
  computed: {
    markList () {
      const setValue = function setValue (obj, key, value) {
        if (typeof obj[key] === 'undefined') {
          Vue.set(obj, key, value)
        }
      }
      this.marks.forEach((item, index) => {
        setValue(item, 'focus', false)
        setValue(item, 'zIndex', index + 1)
      })
      return this.marks
    },
  },
  mounted () {
    // TODO not use this, if user pull to outof img would cause error
    // document.addEventListener('mouseup', this.handleMouseUp, false);
  },
  data () {
    return {
      status: {
        index: -1,
        offX: 0,
        offY: 0,
      },
      markStatus: [],
      preventFlag: false,
      dragging: false,
    }
  },
  methods: {
    resetStatus () {
      this.status = {
        index: -1,
        offX: 0,
        offY: 0,
      }
    },
    handleMouseDown (e, mark, index) {
      console.log('mouseDown')
      if (this.status.index !== -1) {
        // has current mark
        return
      }
      this.status = {
        index,
        offX: e.clientX - mark.left,
        offY: e.clientY - mark.top,
        startX: e.clientX,
        startY: e.clientY
      }
      // TODO important
      e.preventDefault()
    },
    handleMouseUp (e, mark, index) {
      console.log('mouseUp')
      this.eleSelect = false
      // alway trigger move, judge, if startXY too close, think as click
      if (Math.abs(e.clientX - this.status.startX) < 5 && Math.abs(e.clientY - this.status.startY) < 5) {
        this.markClick(this.marks[this.status.index], this.status.index)
        this.dragging = false
      }
      // if (!this.dragging) {
      // }
      // mark.startX = e.clientX;
      // mark.startY = e.clientY;
      this.resetStatus()
    },
    handleMouseOver (e, mark, index) {
      // console.log('mouseOver');
      // this.dragging = false;
      // mark.startX = e.clientX;
      // mark.startY = e.clientY;
      // console.log(e.clientX);
      // console.log(e.clientY);
    },
    handleMouseMove (e) {
      console.log('mouseMove')
      if (this.status.index === -1) {
        return
      }
      this.dragging = true
      const mark = this.markList[this.status.index]
      if (!mark.focus) {
        this.getFocus(mark, this.status.index)
      }
      mark.left = e.clientX - this.status.offX
      mark.top = e.clientY - this.status.offY
    },
    markClick (mark, index) {
      if (mark.focus) {
        this.loseFocus(mark, index)
      } else {
        this.getFocus(mark, index)
      }
      this.$emit('markClick', mark, index)
    },
    getFocus (mark, index) {
      this.setAll('focus', false, this.marks)

      this.preventFlag = true
      // if is the largest index, needn't change
      if (mark.zIndex !== this.marks.length) {
        const compare = mark.zIndex
        this.marks.forEach((item, i) => {
          if (i === index) {
            item.zIndex = this.marks.length
            return
          }
          if (item.zIndex > compare) {
            item.zIndex--
          }
        })
      }
      Vue.set(mark, 'focus', true)
    },
    loseFocus (mark, index) {
      Vue.set(mark, 'focus', false)
    },

    setAll (key, value, array) {
      array.forEach(item => {
        item[key] = value
      })
    },
    getItem (key, value, array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
          return array[i]
        }
      }
      return null
    },
  },
}
</script>

<style scoped>
.hui-picture-dragger_outter {
  position: relative;
  display: inline-block;
}

.hui-picture-dragger-dimension_outter {
  position: absolute;
  z-index: 0;
  right: 0;
  top: 10px;
}

.hui-picture-dragger_title {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  background-color: rgba(122, 122, 122, 0.5);
  padding: 5px 10px;
  border-radius: 23px;
}

.hui-picture-dragger-dimension {
  font-size: 12px;
  color: #fff;
}

.hui-picture-dragger_mark {
  position: absolute;
  min-width: 36px;
  line-height: 30px;
  color: #fff;
  cursor: pointer;
  text-align: center;
}

.hui-picture-dragger_mark-content {
  padding: 0 10px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  border-radius: 20px;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
}

.hui-picture-dragger_mark-triangle {
  /* text-align: center; */
  position: absolute;
  left: 19px;
  bottom: -2px;
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
}

.hui-picture-dragger_mark-content__dragging {
  opacity: 0.7;
}
</style>
