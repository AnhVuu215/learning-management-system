const jwt = require('jsonwebtoken');

const getAccessConfig = () => ({
  secret: process.env.JWT_SECRET || 'supersecret',
  expiresIn: process.env.JWT_EXPIRES_IN || '12h',
});

const getRefreshConfig = () => ({
  secret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecret',
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
});

const signToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, {
    expiresIn,
  });

const verifyToken = (token, secret) => jwt.verify(token, secret);

const generateAccessToken = (payload) => {
  const { secret, expiresIn } = getAccessConfig();
  return signToken(payload, secret, expiresIn);
};

const generateRefreshToken = (payload) => {
  const { secret, expiresIn } = getRefreshConfig();
  return signToken(payload, secret, expiresIn);
};

const verifyAccessToken = (token) => {
  const { secret } = getAccessConfig();
  return verifyToken(token, secret);
};

const verifyRefreshToken = (token) => {
  const { secret } = getRefreshConfig();
  return verifyToken(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

