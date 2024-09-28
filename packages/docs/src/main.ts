import { createApp } from 'vue'
import App from './App.vue'
import element from './plugins/element'
import store from '@/store'
import router from './router'
import i18n from 'root-common/i18n'
import '@/assets/css/index.scss'
const app = createApp(App)
app.use(store).use(i18n).use(router).use(element).mount('#app')
