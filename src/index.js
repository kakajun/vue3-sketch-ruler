// Import vue component
import SketchRule from './sketchRuler/sketchRuler.vue'

// Declare install function executed by Vue.use()
export function install(app) {
  app.component(SketchRule.name, SketchRule)
}

// Create module definition for Vue.use()
const plugin = {
  install,
  SketchRule
}

export { SketchRule }
// To allow use as module (npm/webpack/etc.) export component
export default plugin
