import Vue from 'vue';
import App from './App.vue';
import PictureDrag from '../../src/index';

Vue.use(PictureDrag);

new Vue({ // eslint-disable-line
  el: '#app',
  render: h => h(App)
});