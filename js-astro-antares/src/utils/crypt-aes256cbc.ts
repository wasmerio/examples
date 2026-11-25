import CryptoJS from 'crypto-js';

const [keySalt, ivSalt] = [CryptoJS.lib.WordArray.random(128/8), CryptoJS.lib.WordArray.random(128/8)]

export const encrypt = (password: string, content: string) => {
  const key = CryptoJS.PBKDF2(password, keySalt, { keySize: 256/32, iterations: 100000 });
  const iv = CryptoJS.PBKDF2(password, ivSalt, { keySize: 128/32, iterations: 100000 });
  const encryptedContent = CryptoJS.AES.encrypt(content, key, { iv: iv }).toString();
  return {
    content: encryptedContent,
    keySaltHex: keySalt.toString(CryptoJS.enc.Hex),
    ivSaltHex: ivSalt.toString(CryptoJS.enc.Hex)
  };
};

export const decrypt = (password: string, encryptedContent: string, keySaltHex: string, ivSaltHex: string) => {
  try {
    const keySalt = CryptoJS.enc.Hex.parse(keySaltHex);
    const ivSalt = CryptoJS.enc.Hex.parse(ivSaltHex);
    const key = CryptoJS.PBKDF2(password, keySalt, { keySize: 256/32, iterations: 100000 });
    const iv = CryptoJS.PBKDF2(password, ivSalt, { keySize: 128/32, iterations: 100000 });
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedContent, key, { iv: iv });
    const decryptedContent = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedContent;
  } catch (error) {
    return ''
  }
};