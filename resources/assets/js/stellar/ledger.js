import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Str from '@ledgerhq/hw-app-str';
import StellarSdk from 'stellar-sdk';

export const getAppVersion = async () => {
  const transport = await TransportU2F.create();
  const str = new Str(transport);
  const result = await str.getAppConfiguration();
  return result.version;
}

export const getPublicKey = async (bip32Path, validate, display) => {
  const transport = await TransportU2F.create();
  const str = new Str(transport);
  const result = await str.getPublicKey(bip32Path, validate, display);
  return result.publicKey;
};

export const signTransaction = async (transaction, bip32Path, keypair) => {
  const transport = await TransportU2F.create();
  const str = new Str(transport);
  const result = await str.signTransaction(bip32Path, transaction.signatureBase());

  const hint = keypair.signatureHint();
  const decorated = new StellarSdk.xdr.DecoratedSignature({hint: hint, signature: result.signature});

  transaction.signatures.push(decorated);

  return transaction;
}
