#!/usr/bin/env node

/* eslint no-console:0, no-undef:0 */
const crypto = require('crypto')

export const decrypt = (key, ciphertext) => {
  key = Buffer.from(key, 'hex')
  ciphertext = Buffer.from(ciphertext, 'base64')

  const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, ciphertext.slice(0, 12))
  aesgcm.setAuthTag(ciphertext.slice(-16))
  const plaintext = aesgcm.update(ciphertext.slice(12, -16)) + aesgcm.final()

  return plaintext
}
