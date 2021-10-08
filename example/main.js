import { createApp } from 'vue'
import App from './App.vue'
// import '../dist/style.css'
// import SketchRule from "../dist/index.es.js?4563452";
const app = createApp(App)
// app.use(SketchRule);

// const MyComponent = app.component('SketchRule')
// console.log(MyComponent, 'MyComponentMyComponent')
app.mount('#app')
