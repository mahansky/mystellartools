<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex>
                        <div class="display-2">Get started</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container class="mt-3">
            <v-layout>
                <v-flex xs12>
                    <div class="textblock">
                        <div class="headline">Stellar, Lumens, XLM, Basic concepts</div>
                        <p>
                            Check out the
                            <a href="https://www.stellar.org/how-it-works/stellar-basics/" target="_blank" rel="noreferrer nofollow">official website</a>.
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline">Public keys</div>
                        <p>
                            Public keys are shown mostly in the form of first 6 characters, triple dot, last 6 characters.
                            You can click the triple dot to show a popup containing the full version of public key
                            as well as button to copy it.
                        </p>
                        <p>
                            Blue text in blue border next to the public key is a name of your contact associated with
                            this public key or one of the known accounts (exchanges, anchors).
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline">Data stored in browser</div>
                        <p>
                            If you don't exit the app using top right button "Exit", all the data such as
                            Accounts and Contacts are stored in your browser for your next visit.
                        </p>
                        <p>
                            If you add a secret key as an account, you will be asked to type in a password
                            that will be used to encrypt it so it's safely stored in the browser.
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline">Sending Lumens (XLM) to any email address</div>
                        <p>
                            You can send XLM to any email address by simply entering it as a recipient
                            in the send form.
                            Recipient will receive an email with instructions on how to access the Lumens.
                            If the email hasn't received any Lumens in the past, you will have to
                            send at least 2 XLM.
                            It's because of the <b>Revoke</b> function (described below).
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline">Revoking payment</div>
                        <p>
                            Click on the <b>revert the process</b> in the Send form.
                            After entering the email, you will get your Lumens back
                            (recipient's account will merge with yours).
                        </p>
                        <p>
                            This process has two conditions:
                        </p>
                        <ul>
                            <li>It is the first time this email receives payment</li>
                            <li>Recipient hasn't claimed sent lumens yet</li>
                        </ul>
                    </div>

                    <div class="textblock">
                        <div class="headline">Account viewer</div>
                        <p>
                            You can use MyStellar.Tools as an account viewer.
                            Just enter the app with any public key and you will get all the available info.
                            You can also create links to automatically enter the app:
                            <code>https://mystellar.tools/?public_key=YOURPUBLICKEY</code>.
                        </p>
                        <p>Example <a href="https://mystellar.tools/?public_key=GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7">https://mystellar.tools/?public_key=GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7</a></p>
                    </div>

                    <div class="textblock">
                        <div class="headline">Federation addresses</div>
                        <p>
                            You can have up to 3 federation addresses (Stellar addresses) as our member.
                            Our suffix is <b>*mystellar.tools</b>.
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline">I have an idea/suggestion/problem...</div>
                        <p>
                            Feel free to contact us <a href="mailto:contact@mystellar.tools">contact@mystellar.tools</a>.
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
        title: 'Get started',
      }),

      layout: 'default',
    }
</script>