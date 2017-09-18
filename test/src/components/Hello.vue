<template>
    <div class="hello">
        {{what}}
        <picture-drag
            :img="img">
        </picture-drag>
    </div>
</template>

<script>
export default {
    data () {
        return {
            img: {
                src: require('./testPic.jpg'),
                imgWidth: '1000px',
                imgHeight: '400px',
                alt: '逗你玩',
            },
            itemData: {

            },
        }
    },
    computed: {
        what() {
            return 'asf';
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
