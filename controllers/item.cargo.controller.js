const asyncHandler = require('../middleware/asyncHandler.middleware');
const ItemCargo = require('../models/item.cargo.model');

exports.getAllItems = asyncHandler(async (req, res, next) => {
  const items = await ItemCargo.findAll();
  res.status(200).json({items: items});
});


// Authorization: Basic cm9iaWVsODcxMDEzQGdtYWlsLmNvbTpXY1JiVCMxMw==


