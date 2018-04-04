<template>
  <div id="app">
    <h-picture-drag
      :img="img"
      title="for my lover"
      :dimensions="dimensions"
      :marks="marks">
    </h-picture-drag>
    <button type="button" name="button" @click="test">25</button>
  </div>
</template>

<script>
export default {
  name: 'picture-drag-test',
  data() {
    return {
      img: {
        src: require('./assets/WechatIMG136.png'),
        alt: 'hi',
        imgHeight: '1386',
        imgWidth: '1080'
      },
      dimensions: [
        {
          name: '男生',
          key: 0,
          color: 'rgb(148, 171, 193)'
        },
        {
          name: '女生',
          key: 1,
          color: 'rgb(45, 209, 78)'
        }
      ],
      marks: [
        {
          name: 'hudk',
          dimension: 0,
          id: 11,
          left: 273,
          top: 243
        },
        {
          name: 'kiki',
          dimension: 1,
          id: 22,
          left: 659,
          top: 142
        },
        {
          name: 'love',
          dimension: 0,
          id: 33,
          left: 476,
          top: 214
        }
      ]
    };
  },
  methods: {
    test() {
      console.log(this.marks);
    }
  }
};
</script>