<template>
    <v-container>
        <v-layout row>
            <v-flex xs12>
                <v-expansion-panel expand>
                    <v-expansion-panel-content v-for="operation in operations" :key="operation.id">
                        <div slot="header">
                            <v-layout row>
                                <v-flex lg4>
                                    <code v-text="operation.id" class="mr-3"></code>
                                </v-flex>
                                <v-flex lg8>
                                    <span v-text="operation.type.toUpperCase()"></span>
                                </v-flex>
                            </v-layout>
                        </div>
                        <v-card>
                            <v-card-text class="grey lighten-4">
                                <keep-alive>
                                    <component :is="operation.type" :operation="operation"></component>
                                </keep-alive>

                                <div class="mt-3">
                                    <a :href="operation._links.self.href" target="_blank" rel="noreferrer nofollow">
                                        <small>#{{ operation.id }}</small>
                                    </a>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-flex>
        </v-layout>
        <v-layout row class="mt-3">
            <v-flex md2>
                <v-btn flat class="grey grey--text text--darken-3" @click="prev">
                    <v-icon>chevron_left</v-icon>
                    Prev
                </v-btn>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex md2 class="text-xs-right">
                <v-btn flat class="grey grey--text text--darken-3" @click="next">
                    Next
                    <v-icon>chevron_right</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import { Stellar, StellarServer } from '../../stellar'
  import account_merge from './operations/account_merge.vue'
  import allow_trust from './operations/allow_trust.vue'
  import change_trust from './operations/change_trust.vue'
  import create_account from './operations/create_account.vue'
  import create_passive_offer from './operations/create_passive_offer.vue'
  import inflation from './operations/inflation.vue'
  import manage_data from './operations/manage_data.vue'
  import manage_offer from './operations/manage_offer.vue'
  import path_payment from './operations/path_payment.vue'
  import payment from './operations/payment.vue'
  import set_options from './operations/set_options.vue'

  export default {
    components: {
      account_merge,
      allow_trust,
      change_trust,
      create_account,
      create_passive_offer,
      inflation,
      manage_data,
      manage_offer,
      path_payment,
      payment,
      set_options,
    },

    data () {
      return {
        operations: [],
        nextFunc: null,
        prevFunc: null,
        operations: [
          {
            "_links": {
              "self": {
                "href": "https://horizon.stellar.org/operations/56033152660934657"
              },
              "transaction": {
                "href": "https://horizon.stellar.org/transactions/e9b75ad3ef2cc5b01e1e4c37d4b2b8978b69fa9a244601ebcf0651ba92812baf"
              },
              "effects": {
                "href": "https://horizon.stellar.org/operations/56033152660934657/effects"
              },
              "succeeds": {
                "href": "https://horizon.stellar.org/effects?order=desc&cursor=56033152660934657"
              },
              "precedes": {
                "href": "https://horizon.stellar.org/effects?order=asc&cursor=56033152660934657"
              }
            },
            "id": "56033152660934657",
            "paging_token": "56033152660934657",
            "source_account": "GA5XIGA5C7QTPTWXQHY6MCJRMTRZDOSHR6EFIBNDQTCQHG262N4GGKTM",
            "type": "create_account",
            "type_i": 0,
            "starting_balance": "63.9999800",
            "funder": "GA5XIGA5C7QTPTWXQHY6MCJRMTRZDOSHR6EFIBNDQTCQHG262N4GGKTM",
            "account": "GD4KEL2QMSDIHEGIT2SOZSRG55GLWIXUFTD5FVNDUX4WPMONWROJLP5R"
          },
          {
            "_links": {
              "self": {
                "href": "https://horizon.stellar.org/operations/56505886826303489"
              },
              "transaction": {
                "href": "https://horizon.stellar.org/transactions/67593e4cab226d7082cf4fccfacf95c98b08f697e2c32cdc302eed5076e352d0"
              },
              "effects": {
                "href": "https://horizon.stellar.org/operations/56505886826303489/effects"
              },
              "succeeds": {
                "href": "https://horizon.stellar.org/effects?order=desc&cursor=56505886826303489"
              },
              "precedes": {
                "href": "https://horizon.stellar.org/effects?order=asc&cursor=56505886826303489"
              }
            },
            "id": "56505886826303489",
            "paging_token": "56505886826303489",
            "source_account": "GD4KEL2QMSDIHEGIT2SOZSRG55GLWIXUFTD5FVNDUX4WPMONWROJLP5R",
            "type": "payment",
            "type_i": 1,
            "asset_type": "native",
            "from": "GD4KEL2QMSDIHEGIT2SOZSRG55GLWIXUFTD5FVNDUX4WPMONWROJLP5R",
            "to": "GD4KEL2QMSDIHEGIT2SOZSRG55GLWIXUFTD5FVNDUX4WPMONWROJLP5R",
            "amount": "1.0000000"
          },
          {
            "_links": {
              "self": {
                "href": "https://horizon.stellar.org/operations/56608162882523137"
              },
              "transaction": {
                "href": "https://horizon.stellar.org/transactions/c3d1234aa11077ce32f0f66e635288182dd49b49cfd77183da81099bd2ce2c50"
              },
              "effects": {
                "href": "https://horizon.stellar.org/operations/56608162882523137/effects"
              },
              "succeeds": {
                "href": "https://horizon.stellar.org/effects?order=desc&cursor=56608162882523137"
              },
              "precedes": {
                "href": "https://horizon.stellar.org/effects?order=asc&cursor=56608162882523137"
              }
            },
            "id": "56608162882523137",
            "paging_token": "56608162882523137",
            "source_account": "GD4KEL2QMSDIHEGIT2SOZSRG55GLWIXUFTD5FVNDUX4WPMONWROJLP5R",
            "type": "set_options",
            "type_i": 5,
            "inflation_dest": "GA3FUYFOPWZ25YXTCA73RK2UGONHCO27OHQRSGV3VCE67UEPEFEDCOPA"
          },
          {
            "_links": {
              "self": {
                "href": "https://horizon.stellar.org/operations/59492053033172993"
              },
              "transaction": {
                "href": "https://horizon.stellar.org/transactions/152ec5e4e122a7253c6a222b8bd7cbf415812f3b7532d76333426304367b54b6"
              },
              "effects": {
                "href": "https://horizon.stellar.org/operations/59492053033172993/effects"
              },
              "succeeds": {
                "href": "https://horizon.stellar.org/effects?order=desc&cursor=59492053033172993"
              },
              "precedes": {
                "href": "https://horizon.stellar.org/effects?order=asc&cursor=59492053033172993"
              }
            },
            "id": "59492053033172993",
            "paging_token": "59492053033172993",
            "source_account": "GBU6GMZZ2KTQ33CHNVPAWWEJ22ZHLYGBGO3LIBKNANXUMNEOFROZKO62",
            "type": "manage_offer",
            "type_i": 3,
            "offer_id": 141631,
            "amount": "10000.0000000",
            "price": "0.0577897",
            "price_r": {
              "n": 2889483,
              "d": 50000000
            },
            "buying_asset_type": "credit_alphanum4",
            "buying_asset_code": "BAT",
            "buying_asset_issuer": "GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR",
            "selling_asset_type": "native"
          },
          {
            "_links": {
              "effects": {
                "href": "/operations/574731048718337/effects{?cursor,limit,order}",
                "templated": true
              },
              "precedes": {
                "href": "/operations?cursor=574731048718337\u0026order=asc"
              },
              "self": {
                "href": "/operations/574731048718337"
              },
              "succeeds": {
                "href": "/operations?cursor=574731048718337\u0026order=desc"
              },
              "transaction": {
                "href": "/transactions/574731048718336"
              }
            },
            "asset_code": "CHP",
            "asset_issuer": "GAC2ZUXVI5266NMMGDPBMXHH4BTZKJ7MMTGXRZGX2R5YLMFRYLJ7U5EA",
            "asset_type": "credit_alphanum4",
            "id": 574731048718337,
            "limit": "5.0",
            "paging_token": "574731048718337",
            "trustee": "GAC2ZUXVI5266NMMGDPBMXHH4BTZKJ7MMTGXRZGX2R5YLMFRYLJ7U5EA",
            "trustor": "GDVXG2FMFFSUMMMBIUEMWPZAIU2FNCH7QNGJMWRXRD6K5FZK5KJS4DDR",
            "type_i": 6,
            "type": "change_trust"
          },
          {
            "_links": {
              "effects": {
                "href": "/operations/34359742465/effects/{?cursor,limit,order}",
                "templated": true
              },
              "precedes": {
                "href": "/operations?cursor=34359742465\u0026order=asc"
              },
              "self": {
                "href": "/operations/34359742465"
              },
              "succeeds": {
                "href": "/operations?cursor=34359742465\u0026order=desc"
              },
              "transaction": {
                "href": "/transactions/34359742464"
              }
            },
            "asset_code": "USD",
            "asset_issuer": "GC23QF2HUE52AMXUFUH3AYJAXXGXXV2VHXYYR6EYXETPKDXZSAW67XO4",
            "asset_type": "credit_alphanum4",
            "authorize": true,
            "id": 34359742465,
            "paging_token": "34359742465",
            "trustee": "GC23QF2HUE52AMXUFUH3AYJAXXGXXV2VHXYYR6EYXETPKDXZSAW67XO4",
            "trustor": "GBXGQJWVLWOYHFLVTKWV5FGHA3LNYY2JQKM7OAJAUEQFU6LPCSEFVXON",
            "type_i": 7,
            "type": "allow_trust"
          },
          {
            "_links": {
              "effects": {
                "href": "/operations/25769807873/effects/{?cursor,limit,order}",
                "templated": true
              },
              "precedes": {
                "href": "/operations?cursor=25769807873\u0026order=asc"
              },
              "self": {
                "href": "/operations/25769807873"
              },
              "succeeds": {
                "href": "/operations?cursor=25769807873\u0026order=desc"
              },
              "transaction": {
                "href": "/transactions/25769807872"
              }
            },
            "amount": "10.0",
            "asset_code": "EUR",
            "asset_issuer": "GCQPYGH4K57XBDENKKX55KDTWOTK5WDWRQOH2LHEDX3EKVIQRLMESGBG",
            "asset_type": "credit_alphanum4",
            "from": "GCXKG6RN4ONIEPCMNFB732A436Z5PNDSRLGWK7GBLCMQLIFO4S7EYWVU",
            "id": 25769807873,
            "paging_token": "25769807873",
            "source_asset_code": "USD",
            "source_asset_issuer": "GC23QF2HUE52AMXUFUH3AYJAXXGXXV2VHXYYR6EYXETPKDXZSAW67XO4",
            "source_asset_type": "credit_alphanum4",
            "source_amount": "10.0",
            "source_max": "10.0",
            "to": "GA5WBPYA5Y4WAEHXWR2UKO2UO4BUGHUQ74EUPKON2QHV4WRHOIRNKKH2",
            "type_i": 2,
            "type": "path_payment"
          },
          {
            "_links": {
              "effects": {
                "href": "/operations/799357838299137/effects{?cursor,limit,order}",
                "templated": true
              },
              "precedes": {
                "href": "/operations?cursor=799357838299137\u0026order=asc"
              },
              "self": {
                "href": "/operations/799357838299137"
              },
              "succeeds": {
                "href": "/operations?cursor=799357838299137\u0026order=desc"
              },
              "transaction": {
                "href": "/transactions/799357838299136"
              }
            },
            "account": "GBCR5OVQ54S2EKHLBZMK6VYMTXZHXN3T45Y6PRX4PX4FXDMJJGY4FD42",
            "id": 799357838299137,
            "into": "GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
            "paging_token": "799357838299137",
            "type_i": 8,
            "type": "account_merge"
          },
          {
            "_links": {
              "effects": {
                "href": "/operations/12884914177/effects/{?cursor,limit,order}",
                "templated": true
              },
              "precedes": {
                "href": "/operations?cursor=12884914177\u0026order=asc"
              },
              "self": {
                "href": "/operations/12884914177"
              },
              "succeeds": {
                "href": "/operations?cursor=12884914177\u0026order=desc"
              },
              "transaction": {
                "href": "/transactions/12884914176"
              }
            },
            "id": 12884914177,
            "paging_token": "12884914177",
            "type_i": 9,
            "type": "inflation"
          },
          {
            "_links": {
              "self": {
                "href": "/operations/5250180907536385"
              },
              "transaction": {
                "href": "/transactions/e0710d3e410fe6b1ba77fcfec9e3789e94ff29b2424f1f4bf51e530dbbdf221c"
              },
              "effects": {
                "href": "/operations/5250180907536385/effects"
              },
              "succeeds": {
                "href": "/effects?order=desc&cursor=5250180907536385"
              },
              "precedes": {
                "href": "/effects?order=asc&cursor=5250180907536385"
              }
            },
            "id": "5250180907536385",
            "paging_token": "5250180907536385",
            "source_account": "GCGG3CIRBG2TTBR4HYZJ7JLDRFKZIYOAHFXRWLU62CA2QN52P2SUQNPJ",
            "type": "manage_data",
            "type_i": 10,
            "name": "lang",
            "value": "aW5kb25lc2lhbg=="
          }
        ]
      }
    },

    created () {
//      this.fetch()
    },

    methods: {
      fetch () {
        let vm = this

        StellarServer.operations()
//          .forAccount(this.$store.getters.keypair.publicKey())
          .forAccount('GBU6GMZZ2KTQ33CHNVPAWWEJ22ZHLYGBGO3LIBKNANXUMNEOFROZKO62')
          .limit(10)
          .order('desc')
          .call()
          .then(operations => {
            vm.processResponse(operations)
          })
      },

      processResponse (operations) {
        this.nextFunc = operations.next
        this.prevFunc = operations.prev

        this.operations = operations.records
      },

      prev () {
        let vm = this

        this.prevFunc().then(operations => {
          vm.processResponse(operations)
        })
      },

      next () {
        let vm = this

        this.nextFunc().then(operations => {
          vm.processResponse(operations)
        })
      }
    }
  }
</script>