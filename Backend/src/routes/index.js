const express = require('express');
const invoices = require('./invoices');
const users = require('./users');

const router = express.Router();

router.use('/invoices', invoices);
router.use('/users', users);

module.exports = router;
