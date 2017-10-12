export function flash (store, message, type) {
  store.dispatch('storeFlash', {
    message,
    type,
  })
}