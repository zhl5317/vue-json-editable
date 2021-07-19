import JsonEditor from './JsonEditor.vue'
import JsonView from './JsonView.vue'
import ArrayView from './ArrayView.vue'
import draggable from 'vuedraggable'
import PackageFile from '../package.json'
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
const VERSION = PackageFile.version

const install = (Vue) => {
  if (install.installed) return

  Vue.component('draggable', draggable)
  Vue.component('JsonEditor', JsonEditor)
  Vue.component('json-view', JsonView)
  Vue.component('array-view', ArrayView)

}

export default install

export const components = {
  JsonEditor,
  VERSION
}
