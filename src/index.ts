import SketchRule from './sketchRuler/sketchRuler.vue'

import type { App } from 'vue'

export const _SketchRuleComponent = SketchRule

SketchRule.install = (app: App) => {
  app.component(SketchRule.name, SketchRule)
}

export { SketchRule }
export default SketchRule
