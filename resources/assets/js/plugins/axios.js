import axios from 'axios'
import store from '~/store'
import router from '~/router'
import { flash } from '../utils'

axios.interceptors.request.use(request => {
  if (store.getters.authAccessToken) {
    request.headers.common['Authorization'] = `Bearer ${store.getters.authAccessToken}`
  }

  // request.headers['X-Socket-Id'] = Echo.socketId()

  return request
})

axios.interceptors.response.use(response => response, error => {
  const {status} = error.response

  if (status >= 500) {
    flash(store, 'Ooops. Something went wrong!', 'error')
  }

  if (status === 403) {
    store.dispatch('updateSss', {sss: true, sssOk: false})

    flash(store, 'You have to unlock your account first. (Lock icon in the topbar)', 'error')
  }

  if (status === 401 && store.getters.authCheck) {
    new Promise(() => {
      store.dispatch('refreshTokens')
    }).then(() => {
      if (!store.getters.authCheck) {
        store.dispatch('logout')
        router.push({name: 'login'})
      }
    })
  }

  return Promise.reject(error)
})
