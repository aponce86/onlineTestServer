const express = require('express');
const router = express.Router();
const packageControllers = require('../controllers/package.controller');

router.post('/', packageControllers.createPackage);

router.post('/correo', packageControllers.createPackageCorreo);

router.post('/cubanacan', packageControllers.createPackageCubanacan);

router.get('/doc', packageControllers.doc);

module.exports = router;