<template>
    <main class="receive">
        <v-btn flat info loading v-if="!loaded"></v-btn>
        <v-container grid-list-lg v-if="loaded">
            <v-layout row wrap>
                <v-flex lg6>
                    <v-card class="white">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Setup Stellar address
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <div class="mb-2">
                                <b>Stellar addresses:</b>
                                <ul>
                                    <li v-for="addr in stellarAddresses">
                                        <span v-text="addr"></span>
                                    </li>
                                    <li v-if="stellarAddresses.length === 0"><i>None set</i></li>
                                </ul>
                            </div>

                            <v-form v-model="formValid" ref="form">
                                <v-text-field
                                        v-model="newStellarAddress"
                                        :rules="addressRules"
                                        label="Stellar address"
                                        suffix="*mystellar.tools"
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat :class="{'blue--text': formValid, 'red--text': !formValid}" @click="setAddress">
                                Set
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex lg6>
                    <b>Stellar address</b>
                    <p>
                        Stellar addresses provide an easy way to share your payment details.
                        It replaces your public key with easy to remember name/email/text.
                    </p>
                    <p>
                        Your Stellar address can not be changed later!
                    </p>
                </v-flex>
            </v-layout>

            <v-layout row wrap class="qrcode">
                <transition name="fade">
                    <v-flex v-if="qrcodePublic">
                        <v-card>
                            <v-card-media :src="qrcodePublic" height="200px" contain></v-card-media>
                            <v-card-title>
                                <div>
                                    <span class="break-all" v-text="$store.getters.keypair.publicKey()"></span>
                                </div>
                            </v-card-title>
                            <v-card-actions class="white">
                                <v-spacer></v-spacer>
                                <v-btn icon @click="download(qrcodePublic, 'qrcode-public-address')">
                                    <v-icon>file_download</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </transition>

                <transition name="fade">
                    <v-flex v-for="code in stellarQRCodes" :key="code.text">
                        <v-card>
                            <v-card-media :src="code.img" height="200px" contain></v-card-media>
                            <v-card-title>
                                <div>
                                    <span class="break-all" v-text="code.text"></span>
                                </div>
                            </v-card-title>
                            <v-card-actions class="white">
                                <v-spacer></v-spacer>
                                <v-btn icon @click="download(code.img, 'qrcode-stellar-address')">
                                    <v-icon>file_download</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </transition>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import axios from 'axios'
  import { flash } from '../../utils'
  import { forEach } from 'lodash'

  export default {
    metaInfo: () => ({
      title: 'Receive',
    }),

    data () {
      return {
        loaded: false,
        qrcodePublic: '',
        stellarQRCodes: [],
        formValid: false,
        newStellarAddress: '',
        stellarAddresses: [],
        addressRules: [
          (v) => !!v || 'Stellar address is required',
          (v) => {
            if (! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)) {
              if (! /^[\w]+$/.test(v)) {
                return 'Only emails or alphanumeric names are allowed'
              }
            }

            return true
          }
        ]
      }
    },

    created () {
      this.fetch()
      this.fetchPublicQRCode()
    },

    methods: {
      download (url, name) {
        let link = document.createElement('a');

        link.download = name;
        link.href = url;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

      fetch () {
        this.loaded = false

        axios.get('/api/federation', {
          params: {
            q: this.$store.getters.keypair.publicKey(),
            type: 'id',
          }
        }).then(response => {
          this.stellarAddresses = response.data.all
          this.fetchStellarQRCode()
        }).catch(error => {
        }).then(() => {
          this.loaded = true
        })
      },

      fetchPublicQRCode() {
        axios.get('/api/qrcode', {
          params: {
            text: this.$store.getters.keypair.publicKey(),
          }
        }).then(response => {
          this.qrcodePublic = 'data:image/png;base64,' + response.data.qrcode
        })
      },

      fetchStellarQRCode() {
        forEach(this.stellarAddresses, (addr) => {
          axios.get('/api/qrcode', {
            params: {
              text: addr,
            }
          }).then(response => {
            this.stellarQRCodes.push({
              img: 'data:image/png;base64,' + response.data.qrcode,
              text: addr,
            })
          })
        })
      },

      setAddress () {
        if (this.$refs.form.validate()) {
          axios.post('/api/federation', {
            account_id: this.$store.getters.keypair.publicKey(),
            stellar_address: this.newStellarAddress,
          }).then(() => {
            this.fetch()
          }).catch(error => {
            flash(this.$store, error.response.data.detail, 'error')
          })
        }
      }
    }
  }
</script>