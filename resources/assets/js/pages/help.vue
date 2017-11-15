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

        <v-container>
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
                        <div class="headline">Some items in menu are disabled</div>
                        <p>
                            Your account is "locked".  To unlock it, you have to have it's Secret key.
                            Click on the lock icon in the blue toolbar and enter it to the "Switch" form.
                        </p>
                        <p>
                            If you are logged in and viewing an account with password stored on our servers,
                            you have to unlock it by clicking the lock icon again and entering password
                            in the dialog.
                        </p>
                    </div>

                    <div class="textblock">
                        <div class="headline">Account viewer</div>
                        <p>
                            You can use MyStellar.Tools as an account viewer.
                            Simply create a link in this format
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
                        <div class="headline">I have a idea/suggestion/problem...</div>
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