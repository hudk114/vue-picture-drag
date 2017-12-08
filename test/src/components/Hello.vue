<template>
    <div class="hello">
        <picture-drag
            :img="img"
            :status="status"
            :marks="marks">
        </picture-drag>
    </div>
</template>

<script>
export default {
    data () {
        return {
            img: {
                src: '/static/testPic.jpg',
                imgWidth: '1000px',
                imgHeight: '400px',
                alt: '逗你玩',
            },
            status: [
                {
                    name: '想家',
                    key: 1,
                    color: 'rgb(37, 180, 230)',
                },
            ],
            // [{ name, status, key, left, top, zIndex(可选) }]
            marks: [
                {
                    name: '123',
                    status: 1,
                    id: 2134,
                    left: 35,
                    top: 45,
                },
                {
                    name: '23423523523',
                    status: 1,
                    id: 2134234,
                    left: 350,
                    top: 443,
                },
            ],
        }
    },
    methods: {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
