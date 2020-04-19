const express = require('express');
const router = express.Router();
const packageControllers = require('../controllers/package.controller');

router.post('/', packageControllers.createPackage);

router.get('/doc', packageControllers.doc);

module.exports = router;