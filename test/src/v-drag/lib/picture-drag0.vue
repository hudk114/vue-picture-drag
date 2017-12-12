<template>
    <div class="hui-picture-dragger_outter"
        :style="'width:' + img.imgWidth + 'px;'">
        <img :src="img.src"
            :alt="img.alt"
            class="hui-background"
            :style="'height:' + img.imgHeight + 'px;width:' + img.imgWidth + 'px;'"
            @drop="drop($event)"
            @dragover="allowDrop($event)" />
        <!-- title -->
        <span v-if="title"
            class="hui-picture-dragger_title"
            @drop="drop($event)"
            @dragover="allowDrop($event)">
            {{ title }}
        </span>
        <slot v-else
            name="title"
            @drop="drop($event)"
            @dragover="allowDrop($event)">
        </slot>

        <div class="hui-picture-dragger-dimension_outter"
            v-if="dimensionVisible">
            <span v-for="item in dimension"
                class="hui-picture-dragger-dimension"
                :key="item.key"
                :style="{ backgroundColor: item.color }"
                @drop="drop($event)"
                @dragover="allowDrop($event)">
                {{ item.name }}
            </span>
        </div>
        <slot v-else
            name="dimension"
            @drop="drop($event)"
            @dragover="allowDrop($event)">
        </slot>

        <span v-for="(mark, index) in fixedMarks"
            :key="mark.id"
            :style="{ left:mark.left+'px', top:mark.top+'px', zIndex: mark.zIndex }"
            :ref="'mark' + index"
            draggable="true"
            @dragstart="dragStart($event, mark, index)"
            @dragend="dragEnd($event, mark, index)"
            @click="markClick($event, mark, index)"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            class="hui-picture-dragger_mark">
            <div class="hui-picture-dragger_mark-content"
                :style="{ backgroundColor: mark.focus? '#F14835': getItem('key', mark.dimension, dimension).color }">
                {{mark.name}}
            </div>
            <div class="hui-picture-dragger_mark-triangle">
                <span class="hui-picture-dragger_mark-triangle-content"
                    :style="{ borderTopColor: mark.focus? '#F14835': getItem('key', mark.dimension, dimension).color }"></span>
            </div>
        </span>
    </div>
</template>

<script>
    import Vue from 'vue';

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
            fixedMarks() {
                const setValue = function setValue(obj, key, value) {
                    if ('undefined' === typeof obj[key]) {
                        Vue.set(obj, key, value);
                    }
                };
                this.marks.forEach((item, index) => {
                    // setValue(item, 'offX', 0);
                    // setValue(item, 'offY', 0);
                    setValue(item, 'focus', false);
                    setValue(item, 'zIndex', index + 1);
                });
                return this.marks;
            },
        },
        data() {
            return {
                markStatus: [],
                preventFlag: false,
                dragging: false,
            };
        },
        methods: {
            dragStart(e, mark, index) {
                // for firefox, the default event would open a new window, use '' to prevent
                e.dataTransfer.setData('Text', '');
                // offset is not avilable in most browser, even firefox...
                this.getFocus(mark, index);
                mark.startX = e.clientX;
                mark.startY = e.clientY;
                mark.scrollStartX = window.scrollX;
                mark.scrollStartY = window.scrollY;
                this.dragging = true;
                this.$emit('dragStart');
            },
            dragEnd(e, mark, index) {
                mark.left += (e.clientX - mark.startX + window.scrollX - mark.scrollStartX);
                mark.top += (e.clientY - mark.startY + window.scrollY - mark.scrollStartY);
                this.$emit('dragEnd');
                this.dragging = false;
            },
            markClick(e, mark, index) {
                if (mark.focus) {
                    this.loseFocus(mark, index);
                } else {
                    this.getFocus(mark, index);
                }
                this.$emit('markClick', mark, index);
            },
            allowDrop: function (e) {
                e.preventDefault();
            },
            // hudk: when drop over the image
            drop(e) {
                // TODO hudk: only drop into the dropable, the drop is avilable
                // this.dropable = true;
                e.preventDefault();
            },
            getFocus(mark, index) {
                this.setAll('focus', false, this.marks);

                this.preventFlag = true;
                // if is the largest index, needn't change
                if (mark.zIndex !== this.marks.length) {
                    const compare = mark.zIndex;
                    this.marks.forEach((item, i) => {
                        if (i === index) {
                            item.zIndex = this.marks.length;
                            return;
                        }
                        if (item.zIndex > compare) {
                            item.zIndex--;
                        }
                    });
                }
                Vue.set(mark, 'focus', true);
            },
            loseFocus(mark, index) {
                Vue.set(mark, 'focus', false);
            },


            setAll(key, value, array) {
                array.forEach(item => {
                    item[key] = value;
                });
            },
            getItem(key, value, array) {
                for (let i = 0; i < array.length; i++) {
                    if (array[i][key] === value) {
                        return array[i];
                    }
                }
                return null;
            },
        },
    }
</script>

<style scoped>
    .hui-picture-dragger_outter {
        position: relative;
        display: inline-block;
    }
    .hui-background {

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
        min-width:36px;
        height: 35px;
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
        text-align: center;
    }
    .hui-picture-dragger_mark-triangle-content {
        border: solid 6px rgba(0, 0, 0, 0);
    }
</style>
