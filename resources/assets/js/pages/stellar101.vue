<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex>
                        <div class="display-2">Stellar 101</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container class="mt-3">
            <v-layout>
                <v-flex xs12>
                    <div class="textblock">
                        <div class="headline"><a href="#what-is-stellar" name="what-is-stellar">What is Stellar?</a></div>
                        <p>
                            Stellar is an open-source, distributed payments infrastructure.
                            It uses a decentralized protocol that enables you to send money to anyone in the world,
                            for free, instantly, and in any currency.
                            <br>
                            Stellar is a leapfrog technology that connects people, payment systems,
                            and banks with a focus on the developing world. It lets you facilitate multi-currency
                            and asset transactions quickly, reliably, and for a fraction of a penny
                            by using a crypto-asset called Lumens (XLM) as a bridge.
                        </p>
                        <p>
                            Continue reading:
                            <a href="https://www.stellar.org/how-it-works/stellar-basics/" target="_blank" rel="noreferrer nofollow">https://www.stellar.org/how-it-works/stellar-basics/</a>
                            <br>
                            If you are a developer, jump here:
                            <a href="https://www.stellar.org/developers/" target="_blank" rel="noreferrer nofollow">https://www.stellar.org/developers/</a>
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline"><a href="#where-to-buy-lumens" name="where-to-buy-lumens">Where/How to buy Lumens?</a></div>
                        <div class="title"><a href="exchanges" name="exchanges">Exchanges</a></div>
                        <p>
                            Stellar (Lumens) are listed as XLM or STR.
                        </p>
                        <p>
                            Bittrex
                            <br>
                            <a href="https://bittrex.com/" target="_blank" rel="noreferrer nofollow">https://bittrex.com/</a>

                            <br><br>

                            Poloniex
                            <br>
                            <a href="https://poloniex.com/" target="_blank" rel="noreferrer nofollow">https://poloniex.com/</a>

                            <br><br>

                            Kraken
                            <br>
                            <a href="https://www.kraken.com/" target="_blank" rel="noreferrer nofollow">https://www.kraken.com/</a>

                            <br><br>

                            Binance
                            <br>
                            <a href="https://www.binance.com/" target="_blank" rel="noreferrer nofollow">https://www.binance.com/</a>

                            <br><br>

                            Bitcoin Indonesia
                            <br>
                            <a href="https://www.bitcoin.co.id/" target="_blank" rel="noreferrer nofollow">https://www.bitcoin.co.id/</a>

                            <br><br>

                            Stellar Decentralized Exchange - exchange assets directly on Stellar network
                        </p>

                        <div class="title"><a href="#anchors" name="anchors">Anchors</a></div>
                        <p>
                            Anchors are entities that people trust to hold their deposits and issue credits into the Stellar network for those deposits.
                            All money transactions in the Stellar network (except lumens) occur in the form of credit issued by anchors,
                            so anchors act as a bridge between existing currencies and the Stellar network.
                            Most anchors are organizations like banks, savings institutions, farmers’ co-ops, central banks, and remittance companies.
                        </p>
                        <p>
                            Read more: <a href="https://www.stellar.org/developers/guides/anchor/" target="_blank" rel="noreferrer nofollow">https://www.stellar.org/developers/guides/anchor/</a>
                        </p>

                        <div class="title"><a href="#build-challenge" name="build-challenge">Build Challenge</a></div>
                        <p>
                            <a href="https://www.stellar.org/lumens/build/" target="_blank" rel="noreferrer nofollow">https://www.stellar.org/lumens/build/</a>
                        </p>

                        <div class="title"><a href="#partnership-grant-program" name="partnership-grant-program">Partnership Grant Program</a></div>
                        <p>
                            <a href="https://www.stellar.org/lumens/stellar-partnership-grant-program/" target="_blank" rel="noreferrer nofollow">https://www.stellar.org/lumens/stellar-partnership-grant-program/</a>
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline"><a href="#first-steps" name="first-steps">First steps</a></div>
                        <div class="title"><a href="#creating-stellar-account" name="creating-stellar-account">Creating Stellar account</a></div>
                        <p>
                            Let’s imagine a situation where you have some Lumens on an exchange and you want to have control over them.
                            You will have to create an account on Stellar network. You do that by creating a keypair (pair of public and private keys) and then sending at least 20 XLM to this account.
                        </p>
                        <p>
                            You can create a keypair using MyStellar.Tools. Visit the main page and click “create new Stellar account” in the middle. Save the generated keypair to a secure location (paper wallets / Ledger Nano S).
                        </p>
                        Now, go back to your exchange and withdraw your Lumens to your account (type in your public key). It has to be at least 20 XLM if it’s a new account.
                        <p>
                            Every account must have at least 20 XLM (might be more) at all time.
                            <a href="https://www.stellar.org/developers/guides/concepts/fees.html#minimum-account-balance" target="_blank" rel="noreferrer nofollow">https://www.stellar.org/developers/guides/concepts/fees.html#minimum-account-balance</a>
                        </p>
                        <p>
                            Open up MyStellar.Tools (or any account viewer) and enter your public key to enter the application. You should see your Lumens (might take a while, depending on the exchange).
                        </p>

                        <div class="title"><a href="#first-transaction" name="first-transaction">First transaction</a></div>
                        <p>
                            Enter the MyStellar.Tools using your private key. You should be able to access “Send” section. You will be asked to enter recipient, amount, asset and optional memo.
                        </p>
                        <p>
                            Recipient might be any public key, stellar address (federation address) or any email.
                            Stellar addresses look like this: lambo*mystellar.tools. They are used to replace long, impossible to remember public keys into name of your liking.
                            MyStellar.Tools allows you to send a payment to any email address. Recipient will receive an email with public and secret key to access his Lumens.
                        </p>
                        <p>
                            Amount is pretty straightforward, just remember to send at least 20 XLM if you are creating new account.
                        </p>
                        <p>
                            Asset can be the native XLM, one of the many others you could have, or you can create your own just by typing its codename (ex. SuperToken).
                        </p>
                        <p>
                            Memo is simply just some identifier associated with your payment. If you choose MEMO_TEXT as the type, you can type up to 28 characters long message (ex. “for the pizza, thanks”).
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline"><a href="#inflation-free-lumens" name="inflation-free-lumens">Inflation A.K.A free lumens</a></div>
                        <p>
                            The Stellar distributed network has a built-in, fixed, nominal inflation mechanism. New lumens are added to the network at the rate of 1% each year. Each week, the protocol distributes these lumens to any account that gets over .05% of the “votes” from other accounts in the network.
                        </p>
                        <p>
                            As you can imagine, getting these votes can be pretty hard. To solve this problem, there are pools. Pool has an account everyone votes for and in return, you get a share of the distributed lumens.
                        </p>

                        <div class="title"><a href="#known-inflation-pools" name="known-inflation-pools">Known inflation pools</a></div>
                        <p>
                            <a href="http://xlmpool.com/en.html" target="_blank" rel="noreferrer nofollow">http://xlmpool.com/en.html</a>
                        </p>

                        <div class="title"><a href="#inflation-how-to" name="inflation-how-to">How to set it up</a></div>
                        <p>
                            It’s pretty simple with MyStellar.Tools. Enter the app with secret key, go to the “Set Options” section and fill the Inflation Destination field with public key of the pool. Hit “Set” and wait for your share of lumens.
                        </p>

                        <div class="title"><a href="#lending" name="lending">Lending</a></div>
                        <p>
                            <a href="https://www.reddit.com/r/Stellar/comments/7gbz2o/do_you_lend_your_lumens_on_poloniex_for_a_pasive/dqi01fm/" target="_blank" rel="noreferrer nofollow">https://www.reddit.com/r/Stellar/comments/7gbz2o/do_you_lend_your_lumens_on_poloniex_for_a_pasive/dqi01fm/</a>
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline"><a href="#ledger" name="#ledger">Ledger Nano S</a></div>
                        <p>
                            MyStellar.Tools supports Ledger Nano S. Go to the main page and click on the image "Sign in with Ledger".
                            If you have your device plugged into computer, you should be able to click the "Sign in" button.
                        </p>
                        <p>
                            You can setup inflation destination as described <a href="#inflation-how-to">above</a>.
                        </p>
                        <p>
                            <b>You have to use latest version of your browser</b> to be able to use Ledger Nano S with MyStellar.Tools.
                        </p>
                    </div>

                    <div class="textblock">
                        <p class="grey--text">
                            <i>Some paragraphs were copied from Stellar's website https://stellar.org</i>
                        </p>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  export default {
    metaInfo: () => ({
      title: 'Stellar 101',
    }),

    layout: 'default',
  }
</script>