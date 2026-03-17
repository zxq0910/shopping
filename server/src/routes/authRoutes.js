const express = require('express');
const { register, login, profile } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');
const { registerValidator, loginValidator } = require('../middlewares/validators');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/profile', authenticate, profile);

module.exports = router;
