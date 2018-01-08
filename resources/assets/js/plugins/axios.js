import axios from 'axios'
import store from '~/store'
import { flash } from '~/utils'

axios.interceptors.response.use(response => response, error => {
  const {status} = error.response

  if (status >= 500) {
    flash(store, 'Ooops. Something went wrong!', 'error')
  }

  return Promise.reject(error)
})
