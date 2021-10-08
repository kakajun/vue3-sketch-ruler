import SketchRule from './sketchRuler/sketchRuler.vue'
import type { App } from 'vue'

SketchRule.install = (app: App) => {
  app.component(SketchRule.name, SketchRule)
}

export { SketchRule }
export default SketchRule
