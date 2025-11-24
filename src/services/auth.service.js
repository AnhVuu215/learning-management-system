const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const roles = require('../constants/roles');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');

const sanitizeUser = (user) => user.toJSON();

const buildTokenPayload = (user) => ({
  sub: user._id.toString(),
  role: user.role,
  email: user.email,
});

const storeRefreshToken = async (user, refreshToken, context = {}) => {
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  const tokens = user.refreshTokens || [];
  tokens.push({
    tokenHash,
    device: context.device,
    ipAddress: context.ipAddress,
    createdAt: new Date(),
    lastUsedAt: new Date(),
  });

  user.refreshTokens = tokens.slice(-5);
  await user.save();
};

const issueTokens = async (user, context) => {
  const payload = buildTokenPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  await storeRefreshToken(user, refreshToken, context);

  return {
    user: sanitizeUser(user),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

const removeRefreshToken = async (user, refreshToken) => {
  if (!user.refreshTokens?.length) {
    return;
  }

  const remaining = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const stored of user.refreshTokens) {
    // eslint-disable-next-line no-await-in-loop
    const isMatch = await bcrypt.compare(refreshToken, stored.tokenHash || '');
    if (!isMatch) {
      remaining.push(stored);
    }
  }

  user.refreshTokens = remaining;
  await user.save();
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};

const PUBLIC_ROLES = [roles.STUDENT, roles.INSTRUCTOR];

const register = async (payload, context) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const role = PUBLIC_ROLES.includes(payload.role) ? payload.role : roles.STUDENT;
  const user = await User.create({ ...payload, role });
  return issueTokens(user, context);
};

const login = async ({ email, password }, context) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'Account is not active');
  }

  return issueTokens(user, context);
};

const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    return;
  }
  await removeRefreshToken(user, refreshToken);
};

const refreshSession = async (refreshToken, context) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    let hasMatch = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const stored of user.refreshTokens || []) {
      // eslint-disable-next-line no-await-in-loop
      const isMatch = await bcrypt.compare(refreshToken, stored.tokenHash || '');
      if (isMatch) {
        hasMatch = true;
        break;
      }
    }

    if (!hasMatch) {
      throw new ApiError(401, 'Refresh token revoked');
    }

    await removeRefreshToken(user, refreshToken);
    return issueTokens(user, context);
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Reset your LMS password',
    html: `<p>Hello ${user.fullName},</p><p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore.</p>`,
  });
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw new ApiError(400, 'Reset token is invalid or has expired');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = [];
  await user.save();
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user.toJSON();
};

const updateProfile = async (userId, payload) => {
  const allowedFields = ['fullName', 'bio', 'profession', 'socialLinks', 'avatar'];
  const update = {};
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      update[field] = payload[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user.toJSON();
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  user.refreshTokens = [];
  await user.save();
};

module.exports = {
  register,
  login,
  logout,
  refreshSession,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
};

