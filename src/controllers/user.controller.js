const ApiResponse = require('../utils/ApiResponse');
const userService = require('../services/user.service');
const asyncHandler = require('../middlewares/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers({}, req.query);
  return res.status(200).json(new ApiResponse(200, 'Users fetched', result));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res.status(200).json(new ApiResponse(200, 'User fetched', user));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, 'Profile updated', user));
});

module.exports = {
  listUsers,
  getUser,
  updateProfile,
};

