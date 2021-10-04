import SketchRule from './sketchRuler/sketchRuler.vue'
import { version } from '../package.json'
import type { App } from 'vue'

export const _SketchRuleComponent = SketchRule

const plugin = {
  version,
  install: (app: App) => {
    app.component(SketchRule.name, SketchRule)
  }
}

export { SketchRule }
export default plugin
