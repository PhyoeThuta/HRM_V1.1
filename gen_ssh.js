const crypto = require('crypto');
const fs = require('fs');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  }
});

// We need public key in OpenSSH format, not PEM.
// Node crypto has a way to get ssh-rsa format if we use ssh options?
// Wait, crypto.generateKeyPairSync supports 'ssh' format in newer Node versions?
// Let's use a simpler approach or a different method.
