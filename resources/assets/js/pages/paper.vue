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
                                <v-checkbox
                                        label="With description"
                                        v-model="description"
                                        color="blue"
                                        hide-details
                                ></v-checkbox>
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
      description: true,
    }),

    computed: {
      publicKey () {
        return this.isSecret ? Stellar.Keypair.fromSecret(this.key).publicKey() : this.key
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
          let rows = [
            [
              [
                {
                  text: 'PUBLIC KEY',
                  bold: true,
                  fontSize: 10,
                  margin: [0, 3, 0, 15],
                },
                {
                  text: this.publicKey,
                  fontSize: 18,
                  margin: [0, 0, 10, 17],
                },
                {
                  text: this.description ? '(used for receiving payments, checking balance)' : ' ',
                  fontSize: 8,
                },
              ],
              {
                image: 'publicQR'
              },
            ],
          ]

          if (this.isSecret) {
            rows.push([
              [
                {
                  text: 'SECRET KEY',
                  bold: true,
                  fontSize: 10,
                  margin: [0, 3, 0, 15]
                },
                {
                  text: this.key,
                  fontSize: 18,
                  margin: [0, 0, 10, 17],
                },
                {
                  text: this.description ? '(used for signing transactions, never share with anyone!)' : ' ',
                  fontSize: 8,
                },
              ],
              {
                image: 'secretQR'
              },
            ])
          }

          const pdfDocGenerator = pdfMake.createPdf({
            content: [
              {
                table: {
                  widths: [395, 100],
                  heights: [100, 100],
                  body: rows,
                },
              },
            ],

            images: {
              publicQR: this.publicKeyImgData,
              secretQR: this.isSecret ? this.secretKeyImgData : '',
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
  }
</script>