<template>
    <div id="app">
        <picture-drag :img="img"
            :title="'for my lover'"
            :dimension="dimension"
            :marks="marks">
        </picture-drag>
        <button type="button" name="button" @click="test">25</button>
    </div>
</template>

<script>
    import pictureDrag from './v-drag/lib/picture-drag'

export default {
      components: {
        'picture-drag': pictureDrag,
      },
      name: 'app',
      data () {
        return {
          img: {
            src: require('./assets/WechatIMG136.png'),
            alt: 'hi',
            imgHeight: '1386',
            imgWidth: '1080',
          },
          dimension: [
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
              dimension: 0,
              id: 0,
              left: 273,
              top: 243,
              zIndex: 1, // if no zIndex, would use default index in array
            },
            {
              name: 'kiki',
              dimension: 1,
              id: 1,
              left: 659,
              top: 142,
              zIndex: 2,
            },
            {
              name: 'love',
              dimension: 0,
              id: 0,
              left: 476,
              top: 214,
              zIndex: 3,
            },
          ],
        }
  },
      methods: {
        test () {
          console.log(this.marks)
        }
      },
    }
</script>

<style>
</style>
