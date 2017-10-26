import Vue from 'vue'
import store from '~/store'
import Meta from 'vue-meta'
import routes from './routes'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'

Vue.use(Meta)
Vue.use(Router)

const router = make(
  routes({keypairGuard, keypairCanSignGuard, guestGuard})
)

sync(store, router)

export default router

/**
 * Create a new router instance.
 *
 * @param  {Array} routes
 * @return {Router}
 */
function make (routes) {
  const router = new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })

  // Register before guard.
  router.beforeEach(async (to, from, next) => {
    if (store.getters.authCheck && store.getters.authUser === null) {
      try {
        await store.dispatch('fetchUser')
      } catch (e) { }
    }

    if (store.getters.authCheck && store.getters.accounts === null) {
      try {
        await store.dispatch('fetchAccounts')
      } catch (e) { }
    }

    setLayout(router, to)
    next()
  })

  // Register after hook.
  router.afterEach((to, from) => {
    router.app.$nextTick(() => {
      router.app.$loading.finish()
      router.app.$flash.hide()
    })
  })

  return router
}

/**
 * Set the application layout from the matched page component.
 *
 * @param {Router} router
 * @param {Route} to
 */
function setLayout (router, to) {
  // Get the first matched component.
  const [component] = router.getMatchedComponents({...to})

  if (component) {
    router.app.$nextTick(() => {
      // Start the page loading bar.
      if (component.loading !== false) {
        router.app.$loading.start()
      }

      // Set application layout.
      router.app.setLayout(component.layout || '')
    })
  }
}

function keypairGuard (routes) {
  return beforeEnter(routes, (to, from, next) => {
    if (!store.getters.keypair) {
      if (!store.getters.authCheck) {
        return next({name: 'welcome'})
      } else if (to.name !== 'balance') {
        return next({name: 'balance'})
      }
    }

    return next()
  })
}

function keypairCanSignGuard (routes) {
  return beforeEnter(routes, (to, from, next) => {
    if (store.getters.keypairCanSign || store.getters.keypairSssOk) {
      return next()
    }

    return next({name: 'balance'})
  })
}

function guestGuard (routes) {
  return beforeEnter(routes, (to, from, next) => {
    if (store.getters.authCheck) {
      next({name: 'balance'})
    } else {
      next()
    }
  })
}

/**
 * Apply beforeEnter guard to the routes.
 *
 * @param  {Array} routes
 * @param  {Function} beforeEnter
 * @return {Array}
 */
function beforeEnter (routes, beforeEnter) {
  return routes.map(route => {
    return {...route, beforeEnter}
  })
}

/**
 * @param  {Route} to
 * @param  {Route} from
 * @param  {Object|undefined} savedPosition
 * @return {Object}
 */
function scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  }

  const position = {}

  if (to.hash) {
    position.selector = to.hash
  }

  if (to.matched.some(m => m.meta.scrollToTop)) {
    position.x = 0
    position.y = 0
  }

  return position
}
