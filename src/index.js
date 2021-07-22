import JsonEditor from './JsonEditor.vue'
import JsonView from './JsonView.vue'
import ArrayView from './ArrayView.vue'
import draggable from 'vuedraggable'
import PackageFile from '../package.json'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
const VERSION = PackageFile.version

const install = (v) => {
  if (install.installed) return
  v.component('draggable', draggable)
  v.component('JsonEditor', JsonEditor)
  v.component('json-view', JsonView)
  v.component('array-view', ArrayView)
  v.use(ElementUI);

}

export default install

export const components = {
  JsonEditor,
  VERSION
}
