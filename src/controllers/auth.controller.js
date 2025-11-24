const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');
const asyncHandler = require('../middlewares/asyncHandler');

const buildClientContext = (req) => ({
  device: req.get('user-agent') || 'unknown-device',
  ipAddress: req.ip,
});

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body, buildClientContext(req));
  return res.status(201).json(new ApiResponse(201, 'User registered successfully', result));
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, buildClientContext(req));
  return res.status(200).json(new ApiResponse(200, 'Logged in successfully', result));
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id, req.body.refreshToken);
  return res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshSession(req.body.refreshToken, buildClientContext(req));
  return res.status(200).json(new ApiResponse(200, 'Token refreshed', result));
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return res.status(200).json(new ApiResponse(200, 'Reset instructions sent if the email exists'));
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  return res.status(200).json(new ApiResponse(200, 'Password updated successfully'));
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  return res.status(200).json(new ApiResponse(200, 'Profile fetched', profile));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await authService.updateProfile(req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, 'Profile updated', profile));
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  return res.status(200).json(new ApiResponse(200, 'Password changed successfully'));
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
};

