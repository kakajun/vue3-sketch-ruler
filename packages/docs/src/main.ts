import { createApp } from 'vue'
import App from './App.vue'
import element from './plugins/element'
import store from '@/store'
import router from './router'
const app = createApp(App)
app.use(store).use(router).use(element).mount('#app')
