export default ({ keypairGuard, keypairCanSignGuard, guestGuard }) => [
  { path: '/', name: 'welcome', component: require('~/pages/welcome.vue') },
  { path: '/claim', name: 'claim', component: require('~/pages/claim.vue') },
  { path: '/help', name: 'help', component: require('~/pages/help.vue') },

  ...keypairGuard([
    { path: '/balance', name: 'balance', component: require('~/pages/wallet/balance.vue') },
    { path: '/payments', name: 'payments', component: require('~/pages/wallet/payments.vue') },
    { path: '/receive', name: 'receive', component: require('~/pages/wallet/receive.vue') },
    { path: '/account', name: 'account', component: require('~/pages/wallet/account.vue') },
    { path: '/operations', name: 'operations', component: require('~/pages/tools/operations.vue') },
  ]),

  ...keypairCanSignGuard([
    { path: '/send', name: 'send', component: require('~/pages/wallet/send.vue') },
    { path: '/trustlines', name: 'trustlines', component: require('~/pages/tools/trustlines.vue') },
    { path: '/setoptions', name: 'setoptions', component: require('~/pages/tools/setoptions.vue') },
    { path: '/data', name: 'data', component: require('~/pages/tools/data.vue') },
    { path: '/merge', name: 'merge', component: require('~/pages/tools/merge.vue') },
  ]),

  ...guestGuard([
    { path: '/login', name: 'login', component: require('~/pages/auth/login.vue') },
    { path: '/register', name: 'register', component: require('~/pages/auth/register.vue') },
    { path: '/password', name: 'password', component: require('~/pages/auth/password.vue') },
  ]),

  { path: '*', component: require('~/pages/errors/404.vue') }
]
