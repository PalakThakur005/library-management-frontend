import CryptoJS from "crypto-js";

const SECRET_KEY = "mySecretKey123";

export const decryptData = (cipherText) => {
  try {
    if (!cipherText) return null;

    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted ? JSON.parse(decrypted) : null;
  } catch (err) {
    console.error("Decrypt error:", err);
    return null;
  }
};