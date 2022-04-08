import hljs from 'highlight.js/lib/core'
import html from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

// NOTE: We don't need bash highlighting, but without this there are warnings logged to the console
hljs.registerLanguage('bash', html)
hljs.registerLanguage('html', html)
hljs.registerLanguage('javascript', javascript)

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/examples/',
    redirect: '/examples/basic/',
  },
  {
    path: '/examples/api/',
    component: () => import('../views/ExampleApi.vue'),
  },
  {
    path: '/examples/basic/',
    component: () => import('../views/ExampleBasic.vue'),
  },
  {
    path: '/examples/multiple/',
    component: () => import('../views/ExampleMultiple.vue'),
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('../views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return { el: to.hash }
    }

    return { x: 0, y: 0 }
  },
})

let inited = false
router.afterEach((to, from) => {
  setTimeout(() => {
    const h1 = document.querySelector('h1')
    if (to.path === '/') {
      document.title = h1 ? h1.innerText : 'TIFY'
    } else {
      document.title = h1 ? `${h1.innerText} | TIFY` : 'TIFY'
    }

    if (to.path !== from.path || !inited) {
      hljs.highlightAll()

      // TODO: WORKAROUND: Why isn't scroll position reset on route change?
      if (!to.hash) {
        window.scrollTo(0, 0)
      }
    }

    inited = true
  }, 0)
})

export default router
