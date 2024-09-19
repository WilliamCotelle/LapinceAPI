// src/auth/scrypt.js

import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";

const keyLength = 32;

/**
 * Hash a string using scrypt
 *
 * @param {string} password
 * @returns {string} The salt+hash
 */
export const hash = (password) => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");

    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}.${derivedKey.toString("hex")}`);
    });
  });
};

/**
 * Compare a string with a salt+hash
 *
 * @param {string} password The plain text password
 * @param {string} hash The hash+salt to check against
 * @returns {boolean}
 */
export const compare = (password, hash) => {
  return new Promise((resolve, reject) => {
    const [salt, hashKey] = hash.split(".");
    const hashKeyBuff = Buffer.from(hashKey, "hex");
    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      resolve(timingSafeEqual(hashKeyBuff, derivedKey));
    });
  });
};
