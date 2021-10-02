import SketchRule from './sketchRuler/sketchRuler.vue'
import { version } from '../package.json'
export function install(app) {
  app.component(SketchRule.name, SketchRule)
}

const plugin = {
  version,
  install
}

export { SketchRule }
export default plugin
