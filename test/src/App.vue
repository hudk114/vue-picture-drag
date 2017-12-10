<template>
    <div id="app">
        <picture-drag :img="img"
            :title="'for my lover'"
            :status="status"
            :marks="marks">
        </picture-drag>
        <button type="button" name="button" @click="test">25</button>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {
                img: {
                    src: require('./assets/WechatIMG136.png'),
                    alt: 'hi',
                    imgHeight: '1386',
                    imgWidth: '1080',
                },
                status: [
                    {
                        name: 'boy',
                        key: 0,
                        color: 'rgb(148, 171, 193)',
                    },
                    {
                        name: 'girl',
                        key: 1,
                        color: 'rgb(45, 209, 78)',
                    },
                ],
                marks: [
                    {
                        name: 'hudk',
                        status: 0,
                        id: 0,
                        left: 256,
                        top: 251,
                        index: 1, // if no index, would use default index in array
                    },
                    {
                        name: 'kiki',
                        status: 1,
                        id: 1,
                        left: 670,
                        top: 131,
                        index: 2,
                    },
                ],
            };
        },
        methods: {
            test() {
                console.log(this.marks);
            }        },
    }
</script>

<style>
</style>
