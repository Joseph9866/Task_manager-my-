const express = require('express');
const {signup, login, protect} = require('../controllers/authcontroller');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;