import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import router from './router'
import vuex from './store'
import App from './App.vue'
import './index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(vuex)
app.mount('#app')
