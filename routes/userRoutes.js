const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const {
  createUserValidationRules,
  updateUserValidationRules,
  validate,
} = require('../middleware/validate');

// POST /api/users — Create a user
router.post('/', createUserValidationRules, validate, userController.createUser);

// GET /api/users — List all users
router.get('/', userController.getUsers);

// GET /api/users/:id — Get a single user
router.get('/:id', userController.getUserById);

// PUT /api/users/:id — Update a user
router.put('/:id', updateUserValidationRules, validate, userController.updateUser);

// PATCH /api/users/:id — Partially update a user (same handler as PUT here)
router.patch('/:id', updateUserValidationRules, validate, userController.updateUser);

// DELETE /api/users/:id — Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
