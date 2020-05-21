const express = require('express');
const router = express.Router();
const invoiceCargoController = require('../controllers/invoice.cargo.controller');
const checkAuth = require('../middleware/auth.cargo.middleware');

router.get('/:num', checkAuth, invoiceCargoController.getInvoiceByNumber);
//router.get('/:clientId', checkAuth, invoiceCargoController.getInvoiceByClientId);
router.post('/', checkAuth, invoiceCargoController.createInvoice);

module.exports = router;