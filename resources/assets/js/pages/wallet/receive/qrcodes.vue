<template>
    <div>
        <transition name="fade">
            <v-flex v-if="qrcodePublic">
                <v-card>
                    <v-card-media :src="qrcodePublic" height="200px" contain></v-card-media>
                    <v-card-title>
                        <div>
                            <public-key
                                    hide-contact-name
                                    :value="$store.getters.keypair.publicKey()">
                            </public-key>
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
    </div>
</template>

<script>
  import { forEach } from 'lodash'

  const QRious = require('qrious')

  export default {
    name: 'qrcodes',

    props: ['stellarAddresses'],

    data: () => ({
      qrcodePublic: '',
      stellarQRCodes: [],
    }),

    watch: {
      stellarAddresses (addresses) {
        forEach(addresses, (addr) => {
          this.stellarQRCodes.push({
            img: new QRious({value: addr, padding: 15, size: 200}).toDataURL(),
            text: addr,
          })
        })
      },
    },

    methods: {
      download (url, name) {
        let link = document.createElement('a')

        link.download = name
        link.href = url

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
    },

    created () {
      this.qrcodePublic = new QRious({
        value: this.$store.getters.keypair.publicKey(),
        padding: 15,
        size: 200,
      }).toDataURL()
    },
  }
</script>