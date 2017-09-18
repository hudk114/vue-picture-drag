<template>
    <div class="outter">
        <img :src="img.src"
            :alt="img.alt"
            class="background-img"
            :style="'height:' + img.imgHeight + 'px;width:' + img.imgWidth + ';'" />
        dragabl
    </div>
</template>

<script>
    import defaultConfig from './defaultConfig';

    export default {
        props: [
            'img',
            // 'itemsData',
        ],
        // TODO 子模块的webpack打包？
        computed: {
        },
        beforeMount() {
        },
        data() {
            return {

            };
        },
    }
</script>

<style scoped>
    .background-img {

    }
</style>
