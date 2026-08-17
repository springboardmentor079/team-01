const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

// GET /api/users?role=&page=&limit=&search=
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await User.countDocuments(filter);

  return apiResponse(res, 200, true, "Users fetched", {
    users,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
});

// GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    return apiResponse(res, 404, false, "User not found");
  }
  return apiResponse(res, 200, true, "User fetched", user);
});

// PUT /api/users/:id — admin editing role or isActive only, never password/email here
const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role, isActive },
    { new: true, runValidators: true },
  ).select("-passwordHash");

  if (!user) {
    return apiResponse(res, 404, false, "User not found");
  }
  return apiResponse(res, 200, true, "User updated", user);
});

module.exports = { getAllUsers, getUserById, updateUser };
