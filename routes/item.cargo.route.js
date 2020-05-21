const express = require('express');
const router = express.Router();
//const packageControllers = require('../controllers/package.controller');

const itemCargoControllers = require('../controllers/item.cargo.controller');

const checkAuth = require('../middleware/auth.cargo.middleware');

router.get('/', checkAuth, itemCargoControllers.getAllItems);
//router.get('/:clientId', checkAuth, itemCargoControllers.getInvoiceByClientId);
//router.get('/create', checkAuth, itemCargoControllers.createInvoice);



//router.post('/', packageControllers.createPackage);

//router.get('/doc', packageControllers.doc);

module.exports = router;