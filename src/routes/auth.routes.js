const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(authenticate);

router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.delete('/profile', authController.deleteAccount);
router.post('/logout', authController.logout);

module.exports = router;
