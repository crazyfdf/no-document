import type { App } from 'vue';
import YCard from './card/index.vue'
import YCodeView from './code-view/index.vue'
import YDivider from './divider/index.vue'
// eslint-disable-line
export const context = import.meta.globEager('../../../../packages/vue-components/src/components/**/demo/*.vue')

const components = [YCard, YCodeView, YDivider]

export default {
  install: (vue:App) =>{
    components.forEach((component)=>{
      vue.component(component.name, component)
    })
    return
  }
}
