const sequalizeCargo = require('../util/database.cargo');

const { DataTypes } = require('sequelize');

const ItemSubsidiaryCargo = sequalizeCargo.define('ItemSubsidiary', {

  /*
  itemType: {
    type: DataTypes.STRING
    //required: true
  },
  */

  /*
  itemBrand: {
    type: DataTypes.STRING
   // required: true
  },
  */

  count: {
    type: DataTypes.NUMBER,
    required: true
  },

  minCount: {
    type: DataTypes.NUMBER,
    required: true
  },

  itemLocation: {
    type: DataTypes.STRING
    //required: true,
  },


  itemPartNumber: {
    type: DataTypes.STRING,
    required: true,
  },

  providerId: {
    type: DataTypes.NUMBER,
    required: true
  },

  providerName: {
    type: DataTypes.STRING,
    required: true,
  },

  providerCost: {
    type: DataTypes.NUMBER,
    required: true,
  },

  item: {
    type: DataTypes.NUMBER,
    required: true
  },

  subsidiary: {
    type: DataTypes.NUMBER,
    required: true
  },



}, {
  tableName: 'item_subsidiary'
});

module.exports = ItemSubsidiaryCargo;