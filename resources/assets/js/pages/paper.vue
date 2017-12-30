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

        <v-container class="mt-3">
            <v-layout>
                <v-flex xs12>
                    <v-alert warning value="true">
                        It's recommended to use this tool in offline mode.
                        You can download this website (CTRL+S) and run it on a computer without internet access.
                    </v-alert>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container grid-list-lg>
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
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    info
                                    flat
                                    @click="generate"
                                    :class="{'blue--text': valid, 'red--text': !valid}"
                            >Generate
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex md6>
                    <iframe :src="iframe" frameborder="0" width="100%" height="300"></iframe>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  import { Stellar } from '~/stellar'
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'

  const QRious = require('qrious')

  pdfMake.vfs = pdfFonts.pdfMake.vfs

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
    }),

    computed: {
      publicKey () {
        return Stellar.Keypair.fromSecret(this.key).publicKey()
      },

      publicKeyImgData () {
        return new QRious({value: this.publicKey}).toDataURL()
      },

      secretKeyImgData () {
        return new QRious({value: this.key}).toDataURL()
      },

      isSecret () {
        return this.key[0] === 'S'
      }
    },

    methods: {
      generate () {
        if (this.$refs.form.validate()) {
          const pdfDocGenerator = pdfMake.createPdf({
            content: [
              {
                table: {
                  body: [
                    [
                      [
                        {
                          text: 'Public key',
                          bold: true,
                        },
                        {
                          text: this.publicKey,
                        },
                        ' ',
                        ' ',
                        {
                          text: '(used for receiving payments, checking balance)',
                          fontSize: 8,
                        },
                      ],
                      {
                        image: 'publicQR'
                      },
                    ],
                    [
                      [
                        {
                          text: 'Secret key',
                          bold: true,
                        },
                        {
                          text: this.key,
                        },
                        ' ',
                        ' ',
                        {
                          text: '(used for signing transactions, never share with anyone!)',
                          fontSize: 8,
                        },
                      ],
                      {
                        image: 'secretQR'
                      },
                    ],
                  ],
                },
              },
            ],

            images: {
              publicQR: this.publicKeyImgData,
              secretQR: this.secretKeyImgData,
            },
          })

          pdfDocGenerator.getDataUrl((dataUrl) => {
            this.iframe = dataUrl
          })
        }
      },

      generateNewKeypair () {
        this.key = Stellar.Keypair.random().secret()
      },
    },

    mounted () {
      this.generateNewKeypair()
      this.generate()

      console.log(this.publicKeyImgData)
      console.log(this.secretKeyImgData)
    },
  }
</script>