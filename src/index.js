// import MyLoading from '../lib/MyLoading';
import pictureDrag from '../lib/picture-drag';

const install = function (Vue) {
    // Vue.component('ssd', MyLoading);
    Vue.component('picture-drag', pictureDrag);
};

export default {
    install,
};
