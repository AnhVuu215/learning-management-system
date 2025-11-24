const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { buildPaginationQuery } = require('../utils/pagination');

const listUsers = async (filter = {}, query = {}) => {
  const { limit, skip, sort, page } = buildPaginationQuery(query);
  const [items, total] = await Promise.all([
    User.find(filter).select('-password').sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateProfile = async (id, payload) => {
  const user = await User.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

module.exports = {
  listUsers,
  getUserById,
  updateProfile,
};

