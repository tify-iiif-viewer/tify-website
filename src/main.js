import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'tify'
import 'tify/dist/tify.css'

createApp(App).use(router).mount('#app')
