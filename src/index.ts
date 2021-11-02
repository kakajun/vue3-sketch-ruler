import SketchRule from './sketch-ruler/index.vue'
import SketchRuleWrapper from './sketch-ruler/sketch-ruler-wrapper.vue'
import type { App } from 'vue'

SketchRule.install = (app: App) => {
  app.component(SketchRule.name, SketchRule)
}
;(SketchRuleWrapper as any).install = (app: App) => {
  app.component(SketchRule.name, SketchRule)
}

export { SketchRule, SketchRuleWrapper }
export default SketchRule
