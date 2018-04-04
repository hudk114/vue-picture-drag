# vue-picture-drag
针对Vue的标点拖动组件，以图片为背景，包含可拖动的标点

## import

    npm install --save vue-picture-drag

## usage

    // main.js
    import PictureDrag from 'vue-picture-drag';
    Vue.use(PictureDrag);
    
    // *.vue
    <template>
      <h-picture-drag
        :title="title"
        :img="img"
        :dimensions="dimensions"
        :marks="marks">
      </h-picture-drag>
    </template>

    <script>
    export default {
      data () {
        title: 'this is a demo drag pic',
        img: {
          src: require(imgPath),
          alt: '',
          imgHeight: '1386',
          imgWidth: '1080'
        },
        dimensions: [
          {
            name: 'dimension1',
            key: 0,
            color: 'rgb(148, 171, 193)'
          },
          {
            name: 'dimension2',
            key: 1,
            color: 'rgb(45, 209, 78)'
          }
        ],
        marks: [
          {
            name: 'boy',
            dimension: 0,
            id: 11,
            left: 273,
            top: 243
          },
          {
            name: 'girl',
            dimension: 1,
            id: 22,
            left: 659,
            top: 142
          }
        ]
      }
    };
    </script>

### props:

>title | 标题。若想自定义，传入`''`，并使用`slot="title"`传入
>img | （必须）背景图，包含 src, alt, width（图片宽）, height（图片高）
>dimensions | 维度，区分标记有几种及每种的颜色，包含 name（维度名称）, key（维度值，与mark的dimension对应）, color（维度颜色）
>marks | 标签列表，包含 name（mark名称）, id（mark id, 必须两两不同）, id, left（mark位置，相对于图片左上角）, top（mark位置，相对于图片左上角）

## update
0.1.0 **departured**
use html5 draggable, for chrome only
**now all 0.1.0 is departured!(actually no one use it...)**

0.2.0
use mouse events instead of html5 draggable
compatible for most browser in most platform now.

0.2.1
修复了bugs
加入了centerTop与centerLeft