export default ({ keypairGuard, guestGuard }) => [
  { path: '/', name: 'welcome', component: require('~/pages/welcome.vue') },

  // Authenticated routes.
  ...keypairGuard([
    { path: '/balance', name: 'balance', component: require('~/pages/wallet/balance.vue') },
    { path: '/payments', name: 'payments', component: require('~/pages/wallet/payments.vue') },
    { path: '/send', name: 'send', component: require('~/pages/wallet/send.vue') },
    { path: '/receive', name: 'receive', component: require('~/pages/wallet/receive.vue') },

    { path: '/operations', name: 'operations', component: require('~/pages/tools/operations.vue') },
    { path: '/merge', name: 'merge', component: require('~/pages/tools/merge.vue') },
    // { path: '/settings', component: require('~/pages/settings/index.vue'), children: [
    //   { path: '', redirect: { name: 'settings.profile' }},
    //   { path: 'profile', name: 'settings.profile', component: require('~/pages/settings/profile.vue') },
    //   { path: 'password', name: 'settings.password', component: require('~/pages/settings/password.vue') }
    // ] }
  ]),

  // // Guest routes.
  // ...guestGuard([
  //   { path: '/login', name: 'login', component: require('~/pages/auth/login.vue') },
  //   { path: '/register', name: 'register', component: require('~/pages/auth/register.vue') },
  //   { path: '/password/reset', name: 'password.request', component: require('~/pages/auth/password/email.vue') },
  //   { path: '/password/reset/:token', name: 'password.reset', component: require('~/pages/auth/password/reset.vue') }
  // ]),

  { path: '*', component: require('~/pages/errors/404.vue') }
]
