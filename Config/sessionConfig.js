const crypto = require('crypto');
const cookieSession = require('cookie-session');

const sessionConfig = cookieSession({
  name: 'session',
  secret: crypto.randomBytes(64).toString('hex'),
  maxAge: 24 * 60 * 60 * 1000, 
  secure: false,
});

module.exports = sessionConfig;
