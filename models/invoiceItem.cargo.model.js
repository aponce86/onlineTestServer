const sequalizeCargo = require('../util/database.cargo');

const { DataTypes } = require('sequelize');

const InvoiceItemCargo = sequalizeCargo.define('InvoiceItem',{

  itemType: {
    type: DataTypes.STRING
    //required: true
  },

  itemBrand: {
    type: DataTypes.STRING
   // required: true
  },

  itemPartNumber: {
    type: DataTypes.STRING
    //required: true,
  },

  itemId: {
    type: DataTypes.NUMBER
    //required: true
  },

  itemShortDescription: {
    type:  DataTypes.STRING
    //required: true
  },

  itemWeight: {
    type: DataTypes.NUMBER
   // required: true
  },

  itemCount: {
    type: DataTypes.NUMBER
    //required: true
  },

  itemSalePrice: {
    type:  DataTypes.NUMBER
    //required: true
  },

  itemCost: {
    type: DataTypes.NUMBER
    //required: true
  },
  providerShipping: {
    type:  DataTypes.NUMBER
    //required: true
  },

  img: {
    type:  DataTypes.STRING
   // required: true
  },

  itemLocation: {
    type:  DataTypes.STRING
    //required: true
  },

  clientName: {
    type:  DataTypes.STRING
   // required: true
  },

  noInvoice: {
    type:  DataTypes.STRING
   // required: true,
  },

  owner: {
    type:  DataTypes.NUMBER
  },

  updatedAt: {
    type: DataTypes.NUMBER
  },
  createdAt: {
    type: DataTypes.NUMBER
  }


}, {
  tableName: 'invoiceitem',
  timestamps: false
});

module.exports = InvoiceItemCargo;