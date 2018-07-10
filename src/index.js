import PictureDrag from '../lib/picture-drag';

const install = function install (Vue, opts = {}) {
  Vue.component('h-picture-drag', PictureDrag);
};

export default { install };
