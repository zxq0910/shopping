const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
const { jwt: jwtConfig, adminSeed } = require('../config/env');
const { USER_ROLE } = require('../models/constants');

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
}

async function register({ username, email, password }) {
  const existed = await userRepository.findByEmail(email);
  if (existed) {
    throw new AppError('邮箱已被注册', 409, 'EMAIL_EXISTS');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await userRepository.createUser({
    username,
    email,
    password: hashedPassword,
    role: USER_ROLE.USER,
    avatar: ''
  });
  const user = await userRepository.findById(userId);
  const token = signToken(user);
  return { user, token };
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError('账号或密码错误', 401, 'AUTH_FAILED');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError('账号或密码错误', 401, 'AUTH_FAILED');
  }
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
  return { user: safeUser, token: signToken(safeUser) };
}

async function profile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
  }
  return user;
}

async function ensureAdminAccount() {
  const existed = await userRepository.findByEmail(adminSeed.email);
  if (existed) return existed;

  const hashedPassword = await bcrypt.hash(adminSeed.password, 10);
  const id = await userRepository.createUser({
    username: adminSeed.username,
    email: adminSeed.email,
    password: hashedPassword,
    role: USER_ROLE.ADMIN,
    avatar: ''
  });
  return userRepository.findById(id);
}

module.exports = {
  register,
  login,
  profile,
  ensureAdminAccount
};
