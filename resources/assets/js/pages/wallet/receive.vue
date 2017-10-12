<template>
    <main class="receive">
        <v-container grid-list-lg>
            <v-layout row wrap v-if="!stellarAddress">
                <v-flex lg6>
                    <v-card class="white">
                        <v-card-text>
                            <v-form v-model="formValid" ref="form">
                                <v-text-field
                                        v-model="newStellarAddress"
                                        :rules="addressRules"
                                        label="Stellar address"
                                        suffix="*lumen.money"
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
                        Stellar addresses provide an easy way for users to share payment details by using a syntax that interoperates across different domains and providers.</p>
                    <p>Your Stellar address can not be changed later!</p>
                </v-flex>
            </v-layout>
            <v-layout row wrap v-else>
                <v-flex lg6>
                    <v-card class="white">
                        <v-card-text>
                            <v-text-field
                                    label="Stellar address"
                                    :value="stellarAddress"
                                    suffix="*lumen.money"
                                    disabled
                            ></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex lg6>
                    <b>Stellar address</b>
                    <p>
                        Stellar addresses provide an easy way for users to share payment details by using a syntax that interoperates across different domains and providers.</p>
                    <p>
                        Everyone can make a payment to you using your Stellar address as recipient (they don't have to use your public address anymore).</p>
                </v-flex>
            </v-layout>

            <v-layout row wrap class="qrcode">
                <transition name="fade">
                    <v-flex v-if="qrcodePublic">
                        <v-card>
                            <v-card-media :src="qrcodePublic" height="200px" contain></v-card-media>
                            <v-card-title>
                                <div>
                                    <span>QR Code with your Public Key (address)</span>
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
                    <v-flex v-if="qrcodeStellar">
                        <v-card>
                            <v-card-media :src="qrcodeStellar" height="200px" contain></v-card-media>
                            <v-card-title>
                                <div>
                                    <span>QR Code with your Stellar address</span>
                                </div>
                            </v-card-title>
                            <v-card-actions class="white">
                                <v-spacer></v-spacer>
                                <v-btn icon @click="download(qrcodeStellar, 'qrcode-stellar-address')">
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

  export default {
    data () {
      return {
        qrcodePublic: '',
        qrcodeStellar: '',
        formValid: false,
        newStellarAddress: '',
        stellarAddress: null,
        addressRules: [(v) => !!v || 'Stellar address is required']
      }
    },

    created () {
      axios.get('/api/federation', {
        params: {
          q: this.$store.getters.keypair.publicKey(),
          type: 'id',
        }
      }).then(response => {
        this.stellarAddress = response.data.stellar_address.split('*')[0]
        this.fetchStellarQRCode()
      }).catch(error => {})

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
        axios.get('/api/qrcode', {
          params: {
            text: this.stellarAddress + '*lumens.money',
          }
        }).then(response => {
          this.qrcodeStellar = 'data:image/png;base64,' + response.data.qrcode
        })
      },

      setAddress () {
        if (this.$refs.form.validate()) {
          axios.post('/api/federation', {
            account_id: this.$store.getters.keypair.publicKey(),
            stellar_address: this.newStellarAddress,
          }).then(response => {
            this.stellarAddress = response.data.stellar_address.split('*')[0]
            this.fetchStellarQRCode()
          }).catch(error => {
            flash(this.$store, error.response.data.detail, 'error')
          })
        }
      }
    }
  }
</script>