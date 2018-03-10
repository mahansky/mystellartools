export default ({ keypairGuard }) => [
  { path: '/', name: 'welcome', component: require('~/pages/welcome.vue') },
  { path: '/claim', name: 'claim', component: require('~/pages/claim.vue') },
  { path: '/transaction-signer', name: 'txsigner', component: require('~/pages/txsigner.vue') },
  { path: '/paper-wallet', name: 'paper', component: require('~/pages/paper.vue') },
  { path: '/help', name: 'help', component: require('~/pages/help.vue') },

  { path: '/login', name: 'login', component: require('~/pages/login.vue'), children: [
    { path: 'hw-wallet', name: 'login.hw', component: require('~/pages/login/hw.vue') },
    { path: 'public-key', name: 'login.public', component: require('~/pages/login/public.vue') },
    { path: 'secret-key', name: 'login.secret', component: require('~/pages/login/secret.vue') },
    { path: 'create', name: 'login.create', component: require('~/pages/login/create.vue') },
  ] },

  { path: '/explorer', name: 'explorer', component: require('~/pages/explorer/index.vue') },
  { path: '/explorer/ledgers/:ledger', name: 'explorer.ledger', component: require('~/pages/explorer/ledger.vue') },
  { path: '/explorer/transactions/:transaction', name: 'explorer.transaction', component: require('~/pages/explorer/transaction.vue') },
  { path: '/explorer/accounts/:account', name: 'explorer.account', component: require('~/pages/explorer/ledger.vue') },
  { path: '/explorer/network', name: 'explorer.network', component: require('~/pages/explorer/network.vue') },

  ...keypairGuard([
    { path: '/balance', name: 'balance', component: require('~/pages/wallet/balance.vue') },
    { path: '/payments', name: 'payments', component: require('~/pages/wallet/payments.vue') },
    { path: '/receive', name: 'receive', component: require('~/pages/wallet/receive.vue') },
    { path: '/account', name: 'account', component: require('~/pages/wallet/account.vue') },
    { path: '/operations', name: 'operations', component: require('~/pages/tools/operations.vue') },
    { path: '/transactions', name: 'transactions', component: require('~/pages/tools/transactions.vue') },
    { path: '/send', name: 'send', component: require('~/pages/wallet/send.vue') },
    { path: '/revoke', name: 'revoke', component: require('~/pages/wallet/revoke.vue') },
    { path: '/trustlines', name: 'trustlines', component: require('~/pages/tools/trustlines.vue') },
    { path: '/setoptions', name: 'setoptions', component: require('~/pages/tools/setoptions.vue') },
    { path: '/data', name: 'data', component: require('~/pages/tools/data.vue') },
    { path: '/merge', name: 'merge', component: require('~/pages/tools/merge.vue') },
  ]),

  { path: '*', component: require('~/pages/errors/404.vue') }
]
