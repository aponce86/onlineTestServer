const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Cubapack envios microservice');
});

module.exports = router;