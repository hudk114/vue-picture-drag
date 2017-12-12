import pictureDrag from '../lib/picture-drag'

const install = function (Vue) {
  Vue.component('picture-drag', pictureDrag)
}

export default {
  install,
}
