@component('mail::message')
# Recover your secret key

MyStellar.Tools has dropped the 'member features' to bring them to everyone right in their browser.
You can now store your accounts (along with encrypted secret keys) and contacts in the browser so the data never leaves your computer.

That said, you will no longer be able to log in and manage your accounts as before.
If you had a secret key stored on our servers, you can get it back by clicking the button below.

@component('mail::button', ['url' => url('recovery')])
Recover secret key
@endcomponent
@endcomponent
