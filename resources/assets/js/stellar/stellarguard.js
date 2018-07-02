import StellarGuardSdk from '@stellarguard/sdk'

export const getAccount = async (publicKey) => {
    return await StellarGuardSdk.getAccount(publicKey)
}