const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SALT_ROUNDS = 10;

// CREATE — POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Hash the password before storing it — never save plain text passwords
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Never send the password back in the response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while creating the user',
      error: error.message,
    });
  }
};

// READ ALL — GET /api/users (with optional pagination via ?page= & ?limit=)
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] }, // never expose password hashes
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: rows,
      pagination: {
        totalUsers: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching users',
      error: error.message,
    });
  }
};

// READ ONE — GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching the user',
      error: error.message,
    });
  }
};

// UPDATE — PUT/PATCH /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found`,
      });
    }

    // If email is being changed, make sure it's not already taken by someone else
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'This email is already in use by another user',
        });
      }
      user.email = email;
    }

    if (name) user.name = name;

    // Only re-hash the password if a new one was actually provided
    if (password) {
      user.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await user.save();

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while updating the user',
      error: error.message,
    });
  }
};

// DELETE — DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found`,
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: `User with id ${id} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting the user',
      error: error.message,
    });
  }
};
