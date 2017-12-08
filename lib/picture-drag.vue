<template>
    <div class="hui-picture-dragger_outter">
        <img :src="img.src"
            :alt="img.alt"
            class="hui-background"
            :style="'height:' + img.imgHeight + 'px;width:' + img.imgWidth + ';'"
            @drop="drop($event)"
            @dragover="allowDrop($event)" />
        <!-- title -->
        <span v-if="title"
            @drop="drop($event)"
            @dragover="allowDrop($event)">
            {{ title }}
        </span>
        <slot v-else
            name="title"
            @drop="drop($event)"
            @dragover="allowDrop($event)">
        </slot>

        <div class="hui-picture-dragger-status_outter"
            v-if="statusVisible">
            <span v-for="item in status"
                class="hui-picture-dragger-status"
                :key="item.key"
                :style="{ backgroundColor: item.color }"
                @drop="drop($event)"
                @dragover="allowDrop($event)">
                {{ item.name }}
            </span>
        </div>
        <slot v-else
            name="status"
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
            <span class="hui-picture-dragger_mark-content"
                :style="{ backgroundColor: markStatus[index].focus? '#F14835': getItem('key', mark.status, status).color }">
                {{mark.name}}
            </span>
            <span class="hui-picture-dragger_mark-triangle"
                :style="{ borderTopColor: markStatus[index].focus? '#F14835': getItem('key', mark.status, status).color }">
            </span>
        </span>
    </div>
</template>

<script>
    import Vue from 'vue';
    import defaultConfig from './defaultConfig';

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
            status: {
                type: Array,
                required: true,
            },
            statusVisible: {
                type: Boolean,
                default: true,
            },
            // [{ name, status, id, left, top, index }]
            marks: {
                type: Array,
                default: [],
            },
        },
        computed: {
            fixedMarks() {
                // 创建一个列表，用于映射 mark 与 focus, index, offx and offy
                this.marks.forEach((item, index) => {
                    Vue.set(this.markStatus, index, {
                        offX: 0,
                        offY: 0,
                        focus: false,
                    });
                });
                this.marks.forEach((item, index) => {
                    if (!item.zIndex) {
                        item.zIndex = index + 1;
                    }
                });
                return this.marks;
            },
        },
        data() {
            return {
                markStatus: [],
            };
        },
        mounted() {

        },
        methods: {
            dragStart(e, mark, index) {
                // the position of the click event and pic has offset, need to set
                this.markStatus[index].offX = mark.left - e.offsetX;
                this.markStatus[index].offY = mark.top - e.offsetY;
                this.getFocus(mark, index);
                this.$emit('dragStart');
            },
            dragEnd(e, mark, index) {
                mark.left = e.offsetX + this.markStatus[index].offX;
                mark.top = e.offsetY + this.markStatus[index].offY;
                this.$emit('dragEnd');
            },
            markClick(e, mark, index) {
                if (this.markStatus[index].focus) {
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
                this.setAll('focus', false, this.markStatus);

                // if is the largest index, needn't change
                if (mark.zIndex !== this.marks.length) {
                    this.marks.forEach((item, i) => {
                        if (i === index) {
                            item.zIndex = this.marks.length;
                        } else {
                            item.zIndex--;
                        }
                    });
                }
                Vue.set(this.markStatus[index], 'focus', true);
            },
            loseFocus(mark, index) {
                Vue.set(this.markStatus[index], 'focus', false);
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

    .hui-picture-dragger-status_outter {
        position: absolute;
        z-index: 0;
        right: 0;
        top: 10px;
    }

    .hui-picture-dragger-status {
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
        padding: 6px 11px 8px 12px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        border-radius: 20px;
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
    }
    .hui-picture-dragger_mark-triangle {
        height: 0;
        width: 0;
        border: solid 6px rgba(0, 0, 0, 0);
    }
</style>
