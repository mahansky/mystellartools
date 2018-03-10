<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex lg12 xl8 offset-xl2>
                        <div class="display-2">Transaction Signer</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container grid-list-lg class="mt-3">
            <v-layout>
                <v-flex lg12 xl8 offset-xl2>
                    <v-layout wrap row>
                        <v-flex lg6 xs12>
                            <div class="headline mb-3">Features</div>

                            <ul class="mb-5">
                                <li>crossplatform (Windows, Mac/OSX, Linux)</li>
                                <li>different networks (public, testnet, custom)</li>
                                <li>multi-sig</li>
                                <li>secret key or Ledger</li>
                                <li>detailed description of transaction</li>
                                <li>open source</li>
                            </ul>

                            <div>
                                <v-btn class="blue" dark target="_blank" rel="noreferrer nofollow"
                                       href="https://github.com/mahansky/mystellartools-txsigner/releases"
                                >
                                    Download
                                    <v-icon right>file_download</v-icon>
                                </v-btn>
                                <v-btn flat target="_blank" rel="noreferrer nofollow"
                                       href="https://github.com/mahansky/mystellartools-txsigner"
                                >
                                    Source code
                                    <v-icon right>code</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                            </div>
                        </v-flex>
                        <v-flex lg6 xs12>
                            <v-carousel icon="stop">
                                <v-carousel-item v-for="(img, i) in images" :src="img" :key="i"></v-carousel-item>
                            </v-carousel>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
  metaInfo: () => ({
    title: 'Transaction Signer',
  }),

  layout: 'default',

  data: () => ({
    images: [
      '/img/txsigner/transaction.png',
      '/img/txsigner/explainer.png',
      '/img/txsigner/signer.png',
      '/img/txsigner/result.png',
    ],
  }),
}
</script>

