const express = require('express');

const { login } = require('../controller/users');


const router = express.Router();

router.post('/login', login);

module.exports = router;