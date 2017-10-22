import axios from 'axios'
import store from '~/store'
import router from '~/router'

axios.interceptors.request.use(request => {
  if (store.getters.authAccessToken) {
    request.headers.common['Authorization'] = `Bearer ${store.getters.authAccessToken}`
  }

  // request.headers['X-Socket-Id'] = Echo.socketId()

  return request
})

axios.interceptors.response.use(response => response, error => {
  const { status } = error.response

  if (status >= 500) {
    console.log('Server error 500')
  }

  if (status === 401 && store.getters.authCheck) {
    console.log('Not authenticated')

    new Promise(store.dispatch('logout')).then(() => {
        router.push({ name: 'login' })
    })
  }

  return Promise.reject(error)
})
