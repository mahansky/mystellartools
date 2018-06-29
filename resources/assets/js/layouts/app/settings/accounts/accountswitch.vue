<template>
    <v-card-text>
        <b>Switch to another account</b>
        <p>
            If you enter secret key or use Ledger, account will be unlocked.
        </p>
        <v-form v-model="viewForm.valid" ref="viewFormRef" @submit.prevent="">
            <v-checkbox
                    label="Switching to Ledger Nano S account?"
                    v-model="viewForm.ledger"
                    light
                    color="blue"
                    hide-details
            ></v-checkbox>
            <v-text-field
                    v-if="!viewForm.ledger"
                    label="Public or Secret key"
                    v-model="viewForm.key"
                    :rules="viewForm.rules"
            ></v-text-field>
            <v-text-field
                    v-if="viewForm.ledger"
                    label="Bip 32 Path"
                    v-model="viewForm.bip32Path"
                    :rules="viewForm.bip32PathRules"
            ></v-text-field>
        </v-form>
        <v-layout row>
            <v-spacer></v-spacer>
            <v-btn
                    flat
                    :class="{'blue--text': viewForm.valid, 'red--text': !viewForm.valid}"
                    @click="view"
            >Switch</v-btn>
        </v-layout>
    </v-card-text>
</template>

<script>
  import { Stellar, resolveAccountId } from '~/stellar'
  import { flash } from '~/utils'
  import { ruleBip32Path } from '~/stellar/index'
  import { getPublicKey, getAppVersion } from '~/stellar/ledger'

    export default {
      data: (vm) => ({
        viewForm: {
          valid: false,
          ledger: false,
          bip32Path: "44'/148'/0'",
          bip32PathRules: [(v) => ruleBip32Path(v)],
          key: '',
          rules: [(v) => {
            if (vm.viewForm.ledger) {
              return true
            }

            if (new RegExp('^.+\\*.+$').test(v)) {
              return true
            }

            if (vm.viewForm.key.startsWith('G')) {
              try {
                Stellar.Keypair.fromPublicKey(v)

                return true
              } catch (e) {
                return 'Invalid key'
              }
            } else {
              try {
                Stellar.Keypair.fromSecret(v)

                return true
              } catch (e) {
                return 'Invalid key'
              }
            }
          }],
        }
      }),

      methods: {
        view () {
          if (this.viewForm.ledger) {
            getAppVersion()
              .then(version => {
                return getPublicKey(this.viewForm.bip32Path).then((publicKey) => {
                  this.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromPublicKey(publicKey)})
                  this.$store.dispatch('accessWithLedger', {bip32Path: this.viewForm.bip32Path, version})

                  this.$emit('done')
                })
              })
              .catch(() => {
                flash('Failed to connect to Ledger', 'error')
              })
          } else {
            if (this.$refs.viewFormRef.validate()) {
              new Promise((r) => {
                if (Stellar.StrKey.isValidEd25519SecretSeed(this.viewForm.key)) {
                  r(Stellar.Keypair.fromSecret(this.viewForm.key))
                } else {
                  resolveAccountId(this.viewForm.key).then(({account_id}) => {
                    r(Stellar.Keypair.fromPublicKey(account_id))
                  })
                }
              })
                .then(keypair => {
                  this.$store.dispatch('storeKeypair', {keypair})

                  this.viewForm.key = ''

                  this.$emit('done')
                })
                .catch(flash)
            }
          }
        }
      }
    }
</script>