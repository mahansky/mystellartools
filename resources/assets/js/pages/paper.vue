<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex>
                        <div class="display-2">Paper wallet</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <!--<v-container class="mt-3">-->
        <!--<v-layout>-->
        <!--<v-flex xs12>-->
        <!--<v-alert warning value="true">-->
        <!--It's recommended to use this tool in offline mode.-->
        <!--You can download this website (CTRL+S) and run it on a computer without internet access.-->
        <!--</v-alert>-->
        <!--</v-flex>-->
        <!--</v-layout>-->
        <!--</v-container>-->

        <v-container grid-list-lg class="mt-3">
            <v-layout>
                <v-flex md6>
                    <v-card class="white">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Generate paper wallet
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form ref="form" v-model="valid">
                                <v-text-field
                                        label="Stellar Public or Private Key"
                                        v-model="key"
                                        :rules="keyRules"
                                        append-icon="autorenew"
                                        :append-icon-cb="generateNewKeypair"
                                ></v-text-field>
                                <v-select
                                        label="Design"
                                        v-model="design"
                                        :items="designs"
                                        :hint="designHint"
                                        permanent-hint
                                ></v-select>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <small class="grey--text pr-1">It might take a few seconds</small>
                            <v-btn
                                    info
                                    flat
                                    @click="generate"
                                    :class="{'blue--text': valid, 'red--text': !valid}"
                            >Generate PDF
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex md6>
                    <iframe :src="iframe" frameborder="0" width="100%" height="350"></iframe>
                </v-flex>
            </v-layout>
        </v-container>

        <canvas style="display: none" ref="canvas" width="2480" height="3508"></canvas>
    </div>
</template>

<script>
  import { Stellar } from '~/stellar'
  import { mapValues } from 'lodash'

  const jsPDF = require('jspdf')
  const QRious = require('qrious')

  const requireContext = require.context('./paper', false, /.*\.js$/)

  const wallets = requireContext.keys()
    .map(file =>
      [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
    )
    .reduce((modules, [name, module]) => {
      modules[name] = module
      return modules
    }, {})

  export default {
    metaInfo: () => ({
      title: 'Paper wallet',
    }),

    layout: 'default',

    data: () => ({
      valid: false,
      key: '',
      keyRules: [
        (v) => !!v || 'Key is required',
        (v) => {
          let secret = v[0] === 'S'

          try {
            if (secret) {
              Stellar.Keypair.fromSecret(v)
            } else {
              Stellar.Keypair.fromPublicKey(v)
            }
          } catch (e) {
            return 'Invalid key'
          }

          return true
        }
      ],
      iframe: '',
      design: 'wallet1',
      designHint: '',
    }),

    computed: {
      publicKey () {
        return this.isSecret ? Stellar.Keypair.fromSecret(this.key).publicKey() : this.key
      },

      publicKeyImgData () {
        return new QRious({value: this.publicKey, size: 300}).toDataURL()
      },

      secretKeyImgData () {
        return new QRious({value: this.key, size: 300}).toDataURL()
      },

      isSecret () {
        return this.key[0] === 'S'
      },

      designs () {
        let data = []

        for (let wallet in wallets) {
          if (wallets.hasOwnProperty(wallet)) {
            data.push(wallets[wallet].info)
          }
        }

        return data
      },
    },

    watch: {
      design (name) {
        this.designHint = wallets[this.design].info.credit
      },
    },

    methods: {
      generate () {
        if (this.$refs.form.validate()) {
          let publicQR = new Image
          publicQR.src = this.publicKeyImgData

          let secretQR = new Image
          secretQR.src = this.secretKeyImgData

          let ctx = this.$refs.canvas.getContext('2d')
          ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)

          Promise.all([
            new Promise((r) => {
              publicQR.onload = r
            }),
            new Promise((r) => {
              secretQR.onload = r
            })
          ]).then(() => {
            ctx.fillStyle = '#000'

            wallets[this.design].draw({
              ctx,
              publicQR,
              secretQR,
              publicKey: this.publicKey,
              secretKey: this.isSecret ? this.key : null,
            }).then(() => {
              let doc = new jsPDF()

              doc.internal.scaleFactor = 1.33
              doc.addImage(this.$refs.canvas.toDataURL(), 'PNG', 0, 0, 210, 297)

              this.iframe = doc.output('bloburi')
            })
          })
        }
      },

      generateNewKeypair () {
        this.key = Stellar.Keypair.random().secret()
      },
    },
  }
</script>