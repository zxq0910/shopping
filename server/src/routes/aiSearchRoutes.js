const express = require('express');
const aiSearchController = require('../controllers/aiSearchController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/upload', authenticate, upload.single('image'), aiSearchController.upload);
router.post('/match', authenticate, aiSearchController.match);

module.exports = router;
