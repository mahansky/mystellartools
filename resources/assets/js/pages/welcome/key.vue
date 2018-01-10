<template>
    <v-form v-model="valid" ref="form" class="mt-4 pt-4">
        <v-text-field
                label="Stellar Public or Private Key"
                v-model="key"
                :rules="keyRules"
                append-icon="aspect_ratio"
                :append-icon-cb="openQrDialog"
        ></v-text-field>

        <v-layout class="text-xs-center">
            <v-flex>
                <v-btn dark @click="enter" :class="{ 'blue': valid, '': !valid }">enter</v-btn>
                or
                <a href="#" @click.prevent.stop="createAccount">create new Stellar account</a>
            </v-flex>
        </v-layout>

        <v-dialog v-model="qrDialog" lazy absolute width="340">
          <v-card>
            <v-card-title>
              <div class="headline">QR Code reader</div>
            </v-card-title>
            <v-card-text>
              <span class="red--text" v-if="qrError" v-text="qrError"></span>
              <video ref="video" autoplay="true" style="display:none"></video>
              <canvas 
                      ref="canvas" 
                      :width="qrWidth" 
                      :height="qrHeight" 
                      :style="{width: qrWidth + 'px', height: qrHeight + 'px', display: qrError ? 'none' : 'block'}"
              ></canvas>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click.native="closeQrDialog">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
import { events } from '~/utils'
import { Stellar } from '~/stellar'

const jsQR = require('jsqr')

export default {
  data: () => ({
    valid: false,
    key: '',
    keyRules: [
      v => !!v || 'Key is required',
      v => {
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
    qrDialog: false,
    qrError: '',
    qrWidth: 300,
    qrHeight: 300,
  }),

  watch: {
    qrDialog (opened) {
      if (opened) {
        window.setTimeout(() => {
          this.ctx = this.$refs.canvas.getContext('2d')
        }, 10)
      }
    },
  },

  methods: {
    enter () {
      if (this.$refs.form.validate()) {
        let keypair = null

        if (this.key[0] === 'S') {
          keypair = Stellar.Keypair.fromSecret(this.key)
        } else {
          keypair = Stellar.Keypair.fromPublicKey(this.key)
        }

        this.$store.dispatch('storeKeypair', {keypair})
        this.$router.push('balance')
      }
    },

    createAccount () {
      events.$emit('welcome.key:create-account')
    },

    openQrDialog() {
      this.qrDialog = true

      this.$nextTick(() => {
        window.navigator.getUserMedia =
          window.navigator.getUserMedia ||
          window.navigator.webkitGetUserMedia ||
          window.navigator.mozGetUserMedia

        if (window.navigator.getUserMedia) {
          window.navigator.getUserMedia(
            { video: true },
            this.successCallback,
            this.errorCallback,
          )

          window.requestAnimationFrame(this.tick)
        } else {
          this.qrError = 'Your browser does not support this feature or you have to give it the permissions to access your camera.'
        }
      })
    },

    successCallback(stream) {
      this.mediaStream = stream

      if (window.URL) {
        this.$refs.video.src = window.URL.createObjectURL(stream)
      } else if (this.$refs.video.mozSrcObject !== undefined) {
        this.$refs.video.mozSrcObject = stream
      } else {
        this.$refs.video.src = stream
      }
    },

    errorCallback() {
      this.qrError = 'Uknown Error'
    },

    tick() {
      let decoded = null

      if (this.$refs.video.readyState === this.$refs.video.HAVE_ENOUGH_DATA) {
        this.ctx.drawImage(this.$refs.video, 0, 0, this.qrWidth, this.qrHeight)

        let imageData = this.ctx.getImageData(0, 0, this.qrWidth, this.qrHeight)
        
        decoded = jsQR.decodeQRFromImage(
          imageData.data,
          imageData.width,
          imageData.height
        )
        
        if (decoded) {
          this.key = decoded
          this.closeQrDialog()
        }
      }

      if (!decoded) {
        window.requestAnimationFrame(this.tick)
      }
    },

    closeQrDialog () {
      this.qrDialog = false
      this.mediaStream.getVideoTracks()[0].stop()
      this.mediaStream.getAudioTracks()[0].stop()
    },
  },
}
</script>