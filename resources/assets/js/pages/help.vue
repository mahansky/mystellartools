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
                            <a href="https://www.stellar.org/how-it-works/stellar-basics/" target="_blank" rel="noreferrer nofollow">official website</a>
                            or our
                            <router-link :to="{name: 'stellar101'}">guide</router-link>.
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline">Some items in menu are disabled</div>
                        <p>
                            Your account is "locked".  To unlock it, you have to have it's Secret key.
                            Click on the lock icon in the blue toolbar and enter it to the "Switch" form.
                        </p>
                        <p>
                            If you are logged in and viewing your account secured with password,
                            you have to unlock it by clicking the lock icon again and entering password
                            in the dialog.
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
                            If the email hasn't received any Lumens in the past, you will have to
                            send at least 31 XLM.
                            It's because of the <b>Revoke</b> function (described below).
                            Recipient will receive an email with instructions on how to access the Lumens.
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline">Revoking payment</div>
                        <p>
                            <i>You can stop only payments to a new email address.</i>
                            Click on the <b>revert the process</b> in the Send form.
                            After entering the email, you will get your Lumens back
                            (recipient's account will merge with yours).
                        </p>
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