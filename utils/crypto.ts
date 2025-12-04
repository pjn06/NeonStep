
// Simple obfuscation/encryption for local storage
// Note: Client-side encryption without a user-provided password is never 100% secure,
// but this prevents the key from being read as plain text in LocalStorage.

const SALT = "NEON_STEP_SECURE_SALT_v1";

export const encryptKey = (text: string): string => {
  try {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n: number) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: number) => textToChars(SALT).reduce((a, b) => a ^ b, code);

    return text
      .split("")
      .map(textToChars)
      .map((val) => applySaltToChar(val[0]))
      .map(byteHex)
      .join("");
  } catch (e) {
    console.error("Encryption failed", e);
    return "";
  }
};

export const decryptKey = (encoded: string): string => {
  try {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code: number) => textToChars(SALT).reduce((a, b) => a ^ b, code);
    
    return (encoded.match(/.{1,2}/g) || [])
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  } catch (e) {
    console.error("Decryption failed", e);
    return "";
  }
};
