import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import socketPlugin from '@/plugins/socket'
import '@/styles/main.scss'
import 'virtual:svg-icons-register'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(socketPlugin)

app.mount('#app')
