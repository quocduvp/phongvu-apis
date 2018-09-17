import Cryptr from 'cryptr'
const cryptr = new Cryptr("crypto_key")

export const encryptedString = (string) => {
    return cryptr.encrypt(string)
}
export const decryptedString = (hash) => {
    return cryptr.decrypt(hash)
}