// Import TIFY before the app so the latter can easily override its styles
// import '../tify-symlink/tify'
// import '../tify-symlink/tify.css'
import 'tify'
import tifyCss from 'tify/dist/tify.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Ugly workaround to make tify.css work with WebPack 4
// Also see vue.config.js
const styleTag = document.createElement('style')
styleTag.textContent = tifyCss
document.head.prepend(styleTag)

createApp(App).use(router).mount('#app')
