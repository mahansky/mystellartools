<template>
    <main class="receive">
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex lg6>
                    <v-card class="white">
                        <v-card-text>
                            <v-text-field
                                    label="Stellar address"
                                    value=""
                                    suffix="*lumen.money"
                            ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat class="blue--text">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex lg6>
                    <b>Stellar address</b>
                    <p>
                        Stellar addresses provide an easy way for users to share payment details by using a syntax that interoperates across different domains and providers.</p>
                    <p class="grey--text">As a registered user, you can have up to 3 different Stellar addresses.</p>
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

  export default {
    data () {
      return {
        qrcodePublic: '',
        qrcodeStellar: '',
      }
    },

    created () {
      axios.get('/api/qrcode', {
        params: {
          text: this.$store.getters.keypair.publicKey(),
        }
      }).then(response => {
        this.qrcodePublic = 'data:image/png;base64,' + response.data.qrcode
      })

      axios.get('/api/qrcode', {
        params: {
          text: 'm.pro.mark@gmail.com*lumens.money',
        }
      }).then(response => {
        this.qrcodeStellar = 'data:image/png;base64,' + response.data.qrcode
      })
    },

    methods: {
      download (url, name) {
        let link = document.createElement('a');

        link.download = name;
        link.href = url;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
</script>