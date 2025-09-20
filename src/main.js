// Import TIFY before the app so the latter can easily override its styles
import 'tify'
import 'tify/dist/tify.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
