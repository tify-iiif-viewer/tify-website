import { createApp } from 'vue'

import Tify from 'tify'
import tifyCss from 'tify/dist/tify.css'

import App from './App.vue'
import router from './router'

// Ugly workaround to make tify.css work with WebPack 4
// Also see vue.config.js
const styleTag = document.createElement('style')
styleTag.textContent = tifyCss
document.head.prepend(styleTag)

window.Tify = Tify

createApp(App).use(router).mount('#app')
