<template>
  <div class="picture-dragger__wrapper"
    :style="'width:' + img.imgWidth + 'px;'"
    @mouseup="handleMouseUp($event)"
    @mousemove="handleMouseMove($event)">
    <img class="picture-dragger__background"
      :src="img.src"
      :alt="img.alt"
      :style="'height:' + img.imgHeight + 'px;width:' + img.imgWidth + 'px;'" />
    
    <!-- title -->
    <span v-if="title" class="picture-dragger__title">
      {{title}}
    </span>
    <slot v-else name="title">
    </slot>

    <div class="picture-dragger__dimension__wrapper"
      v-if="dimensions.length > 0">
      <span class="picture-dragger__dimension"
        v-for="item in dimensions"
        :key="item.key"
        :style="{backgroundColor: item.color}">{{item.name}}</span>
    </div>
    <slot v-else name="dimension">
    </slot>

    <span v-for="(mark, index) in markList" 
      @mousedown.left="handleMouseDown($event, mark, index)"
      :key="mark.id" 
      :style="{
        left: mark.left + 'px',
        top: mark.top + 'px',
        zIndex: mark.zIndex
      }"
      :ref="mark.id"
      class="picture-dragger__mark">
        <div 
          :class="[
            {'picture-dragger__mark-content__dragging' : dragging && index === status.index},
            'picture-dragger__mark-content'
          ]"
          :style="{
            backgroundColor: mark.focus? '#F14835': getItem('key', mark.dimension, dimensions).color
          }">
          {{mark.name}}
        </div>
        <div
          :class="[
            {'picture-dragger__mark-content__dragging' : dragging && index === status.index },
            'picture-dragger__mark-triangle'
          ]"
          :style="{
            backgroundColor: mark.focus? '#F14835': getItem('key', mark.dimension, dimensions).color,
            left: _getItemByKey('id', mark.id, marks).width / 2 - 3 + 'px'
          }">
        </div>
    </span>
    <button @click="resetWidthAndHeight(markList)">test</button>
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
    dimensions: {
      type: Array,
      required: true,
    },
    // [{ name, dimension, id, left, top }]
    marks: {
      type: Array,
      default: [],
    },
  },
  computed: {
    markList () {
      const sV = this._setValue;
      // 给marks增加一些用于渲染的东西
      this.marks.forEach((item, index) => {
        sV(item, 'centerLeft', 0);
        sV(item, 'centerTop', 0);
        sV(item, 'left', 0);
        sV(item, 'top', 0);
        sV(item, 'width', 0);
        sV(item, 'height', 0);
        sV(item, 'focus', false);
        sV(item, 'zIndex', index + 1);
      });
      this.resetWidthAndHeight(this.marks);
      return this.marks;
    },
  },
  mounted () {
    // TODO not use this, if user pull to outof img would cause error

    // TODO why???
    this.dragging = true;
    this.resetWidthAndHeight(this.marks);
    this.dragging = false;

    this.resetCenter();
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
      dragging: false
    };
  },
  methods: {
    _setValue (obj, key, value) {
      if (typeof obj[key] === 'undefined') {
        Vue.set(obj, key, value);
      }
    },
    _getItemByKey (key, val, list) {
      for (const item of list) {
        if (item[key] === val) {
          return item;
        }
      }
      return null;
    },
    _getComputedStyle (ele, style) {
      // TODO for ie?
      const styleList = window.getComputedStyle(ele);
      return styleList && styleList[style];
    },
    resetWidthAndHeight (markList) {
      const getWidth = ele => {
        const l = this._getComputedStyle(ele, 'width');
        return l && parseInt(l, 10);
      };
      const getHeight = ele => {
        const h = this._getComputedStyle(ele, 'height')
        return h && parseInt(h, 10);
      };

      for (const id in this.$refs) {
        if (this.$refs.hasOwnProperty(id)) {
          const mark = this._getItemByKey('id', parseInt(id, 10), markList);
          if (!mark) {
            return;
          }
          const ele = this.$refs[id] && this.$refs[id][0];
          Vue.set(mark, 'width', getWidth(ele));
          Vue.set(mark, 'height', getHeight(ele));
        }
      }
    },
    // reset centerLeft and centerTop of the mark
    resetCenter () {
      const judgeExist = val => {
        return !(typeof val === 'undefined' || val === null);
      };

      this.marks.forEach(item => {
        if (!(judgeExist(item.width) || judgeExist(item.height))) {
          return;
        }
        item.centerLeft = item.left + item.width / 2;
        item.centerTop = item.top + item.height + 3;
      });
    },
    resetStatus () {
      this.status = {
        index: -1,
        offX: 0,
        offY: 0
      }
    },
    // click, both click and dragging may trigger this
    handleMouseDown (e, mark, index) {
      // console.log('mouseDown')
      if (this.status.index !== -1) {
        // has current mark
        return;
      }

      this.status = {
        index,
        offX: e.clientX - mark.left,
        offY: e.clientY - mark.top,
        startX: mark.left,
        startY: mark.top
      };
      e.preventDefault();
    },
    handleMouseUp (
      e,
      mark = this.marks[this.status.index],
      index = this.status.index
    ) {
      if (!mark) {
        return;
      }

      // alway trigger move, need judge, if startXY too close, thought as click
      if (
        Math.abs(e.clientX - (this.status.startX + this.status.offX)) < 1 &&
        Math.abs(e.clientY - (this.status.startY + this.status.offY)) < 1
      ) {
        this.markClick(mark, this.status.index);
        this.dragging = false;
        this.resetStatus();
        return;
      }

      // dragging, if out of the image, need reset
      if (this.judgeOut(mark)) {
        mark.left = this.status.startX;
        mark.top = this.status.startY;
      }
      this.resetStatus();
    },
    judgeOut (mark) {
      return this.img.imgHeight < mark.centerTop || this.img.imgWidth < mark.centerLeft
    },
    handleMouseMove (e) {
      if (this.status.index === -1) {
        return;
      }
      this.dragging = true;
      const mark = this.marks[this.status.index];
      if (!mark.focus) {
        this.getFocus(this.status.index);
      }
      mark.left = e.clientX - this.status.offX;
      mark.top = e.clientY - this.status.offY;
    },
    markClick (mark, index) {
      if (mark.focus) {
        this.loseFocus(index);
      } else {
        this.getFocus(index);
      }
      this.$emit('markClick', mark, index);
    },
    getFocus (index) {
      const mark = this.marks[index];
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
      mark.focus = true;
      Vue.set(this.marks, index, mark);
    },
    loseFocus (index) {
      const mark = this.marks[index];
      mark.focus = false;
      Vue.set(this.marks, index, mark);
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
  }
}
</script>

<style>
.picture-dragger__wrapper {
  position: relative;
  display: inline-block;
}

.picture-dragger__title {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  background-color: rgba(122, 122, 122, 0.5);
  padding: 5px 10px;
  border-radius: 23px;
}

.picture-dragger__dimension__wrapper {
  position: absolute;
  z-index: 0;
  top: 10px;
  right: 0;
}

.picture-dragger__dimension {
  padding: 4px 8px;
  font-size: 12px;
  text-align: center;
  color: #fff;
  margin-right: 10px;
}

.picture-dragger__mark {
  position: absolute;
  min-width: 36px;
  line-height: 30px;
  color: #fff;
  cursor: pointer;
  text-align: center;
}

.picture-dragger__mark-content {
  padding: 0 10px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  border-radius: 20px;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
}

.picture-dragger__mark-triangle {
  /* text-align: center; */
  position: absolute;
  bottom: -2px;
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
}

.picture-dragger__mark-content__dragging {
  opacity: 0.7;
}
</style>
