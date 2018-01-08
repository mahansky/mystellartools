import Vue from 'vue'
import store from './store'
import router from './router'

export const events = new Vue()

export function flash (message, type = 'error') {
  store.dispatch('storeFlash', {
    message,
    type,
  })
}

export function getQueryParameter (name, url) {
  if (!url) url = window.location.href

  name = name.replace(/[\[\]]/g, '\\$&')

  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)

  if (!results) return null

  if (!results[2]) return ''

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export function logout () {
  store.dispatch('removeKeypair')
  store.dispatch('removeAccounts')
  store.dispatch('removeContacts')

  router.push({name: 'welcome'})
}