<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap>
            <v-flex xs6>
                <v-card-text>
                    <v-layout>
                        <v-flex xs2>
                            <img src="/img/stellarguard.svg" alt="StellarGuard">
                        </v-flex>
                        <v-flex xs10>
                            <b>StellarGuard</b>
                            <p><a href="https://stellarguard.me" target="_blank" rel="nofollow noreferrer">StellarGuard</a> uses the Stellar's built in multi-signature technology to require a transaction to be signed both by you and by StellarGuard before it is considered valid.</p>

                            <p v-if="badNetwork">StellarGuard supports only official Stellar networks (Main and Testnet)</p>
                            <template v-else>
                                <p v-if="guarded" class="green--text"><v-icon>security</v-icon> <b>Your account is protected by StellarGuard</b></p>
                                <v-btn v-if="!guarded && !badNetwork && step === 0" info class="mx-0" @click="step = 1" :loading="guardedLoading">
                                    <v-icon class="pr-2">security</v-icon> Enable protection
                                </v-btn>

                                <template v-if="step === 1">
                                    <p>Start by creating an account: <a :href="registerLink" target="_blank" rel="nofollow noreferrer">StellarGuard registration</a><br>
                                    Verify your email by clicking at the link you receive after registration.<br>
                                    Copy your StellarGuard Public Key that was generated for you.</p>

                                    <div class="text-xs-right">
                                        <v-btn info class="mx-0" @click="step = 2">Continue</v-btn>
                                    </div>
                                </template>

                                <template v-if="step === 2">
                                    <v-form ref="form" v-model="valid">
                                        <v-text-field
                                            label="StellarGuard Public Key"
                                            v-model="stellarGuardKey"
                                            :rules="stellarGuardKeyRules"
                                            hint="Copied from StellarGuard site after registration"
                                        ></v-text-field>
                                        <v-text-field
                                            label="Backup Public Key"
                                            v-model="backupKey"
                                            :rules="backupKeyRules"
                                        ></v-text-field>
                                    </v-form>

                                    <v-layout>
                                        <v-flex xs6 class="pt-0">
                                            <div class="pt-2"><small><a href="https://stellarguard.me/faq#backup-signer" target="_blank" rel="nofollow noreferrer">What is backup public key?</a></small></div>
                                        </v-flex>
                                        <v-flex xs6 class="text-xs-right pt-0">
                                            <v-btn info class="mx-0" @click="addSigner" :loading="addSignerLoading">Add signer</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </template>

                               <template v-if="step === 3">
                                   <p>Activate the StellarGuard protection by clicking the button.</p>
                                   <div class="text-xs-right">
                                       <v-btn flat @click="step = 2">Back</v-btn>
                                       <v-btn info class="mx-0" @click="activate" :loading="activateLoading">Activate</v-btn>
                                   </div>
                               </template>
                            </template>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { Stellar } from '~/stellar'
import StellarGuardSdk from "@stellarguard/sdk"
import { flash } from '~/utils'
import { submitTransaction } from '~/stellar/internal';

export default {
  data: () => ({
    guarded: false,
    guardedLoading: true,
    step: 0,
    stellarGuardKey: "",
    backupKey: "",
    badNetwork: false,
    getAccountLoading: false,
    addSignerLoading: false,
    activateLoading: false,
    stellarGuardSignerPublicKey: null,
    stellarGuardKeyRules: [v => Stellar.StrKey.isValidEd25519PublicKey(v) || 'Invalid key'],
    backupKeyRules: [v => (v.length === 0 || Stellar.StrKey.isValidEd25519PublicKey(v)) || 'Invalid key'],
    disableLoading: false,
    valid: false,
  }),

  watch: {
    networkSettings() {
      console.log('asd')
      this.init()
    },
  },

  computed: {
    networkSettings() {
      return this.$store.getters.transactionsNetwork
    },

    registerLink() {
      return this.networkSettings.type === "main"
        ? "https://stellarguard.me/"
        : "https://test.stellarguard.me/";
    },
  },

  methods: {
    async init() {
      this.guardedLoading = true

      if (this.networkSettings.type === "main") {
        StellarGuardSdk.usePublicNetwork();
      } else if (this.networkSettings.type === "testnet") {
        StellarGuardSdk.useTestNetwork();
      } else {
        this.badNetwork = true;
      }

      if (!this.badNetwork) {
        try {
          await StellarGuardSdk.getAccount(this.$store.getters.keypair.publicKey())
          this.$store.dispatch('setStellarGuard', true)
        } catch (e) {
          this.$store.dispatch('setStellarGuard', false)
        }
      }

      this.guarded = this.$store.getters.keypairStellarGuard
      this.guardedLoading = false
    },

    addSigner() {
      if (!this.$refs.form.validate()) {
        return
      }

      this.addSignerLoading = true;

      StellarGuardSdk.getMultigSetup(
        this.$store.getters.keypair.publicKey(),
        this.stellarGuardKey,
        this.backupKey
      )
        .then(result => result.xdr)
        .catch(() => flash('Problem with generating transaction. Is your StellarGuard Public Key correct?'))
        .then(xdr => submitTransaction('raw', xdr))
        .then(() => (this.step = 3))
        .catch(err => {
          if (err.message.startsWith('No secret key entered')) {
            this.step = 3
            flash('Sign and submit the transaction manually, then finish the activation here.', 'info')
          } else {
            flash(err)
          }
        })
        .then(() => (this.addSignerLoading = false));
    },

    activate() {
      this.activateLoading = true;

      StellarGuardSdk.activateAccount(this.$store.getters.keypair.publicKey())
        .then(() => {
          this.step = 0
          this.init()
        })
        .catch(() => flash('Complete previous step first!'))
        .then(() => (this.activateLoading = false));
    },
  },

  created() {
    this.init()
  }
};
</script>

