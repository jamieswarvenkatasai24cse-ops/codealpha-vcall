import CryptoJS from 'crypto-js';

const SECRET_KEY = 'vcall-secret-key-change-in-production';

export const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(JSON.stringify(message), SECRET_KEY).toString();
};

export const decryptMessage = (encryptedMessage) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};
