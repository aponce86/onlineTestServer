//const sequelize = require('../util/database');

const sequalizeCargo = require('../util/database.cargo');

const { DataTypes } = require('sequelize');

const ItemCargo = sequalizeCargo.define('Item', {
  //itemWeight: DataTypes.NUMBER,
  //itemDescription: DataTypes.STRING,
  //itemName: DataTypes.STRING,
  //cbm: DataTypes.NUMBER,
  //insurance: DataTypes.NUMBER,
  //owner: DataTypes.NUMBER

  img: {
    type: DataTypes.STRING
    //required: true
  },

  itemName: {
    type: DataTypes.STRING
    //required: true
  },

  itemPartNumber: {
    type: DataTypes.STRING
    //required: true,
    //unique: true
  },

  itemShortDescription: {
    type: DataTypes.STRING
    //required: true,
    //columnType: 'varchar(2048)'
  },

  itemWeight: {
    type: DataTypes.NUMBER
    //required: true
  },

  itemBrand: {
    type: DataTypes.STRING
    //required: true
  },

  itemSalePrice: {
    type: DataTypes.NUMBER
    //required: true
  },

  itemDescription: {
    type: DataTypes.STRING
    //columnType: 'varchar(2048)'
  },

  itemProviderDefault: {
    type: DataTypes.STRING
  },

  itemProviderCost: {
    type: DataTypes.NUMBER
    //required: true
  },

  itemProviderShipping: {
    type: DataTypes.NUMBER
    //required: true
  },

  itemProviderReference: {
    type: DataTypes.STRING
  },

  providerId: {
    type: DataTypes.NUMBER
    //required: true
  },

  showOnline: {
    type: DataTypes.BOOLEAN
    //required: true
  },

  note: {
    type: DataTypes.STRING
  },

  // 0-Normal, 1-Important, 2-Phone
  noteStatus: {
    type: DataTypes.NUMBER
    //required: true
  },

  discountPrice: {
    type: DataTypes.NUMBER
  },

  discountInitDate: {
    type: DataTypes.NUMBER
  },

  discountEndDate: {
    type: DataTypes.NUMBER
  },

  panamaCost: {
    type: DataTypes.NUMBER
  },

  tags: {
    type: DataTypes.STRING
    //columnType: 'varchar(2048)'
  },

  categoryTags: {
    type: DataTypes.STRING
    //columnType: 'varchar(2048)'
  },

  providerTags: {
    type: DataTypes.STRING
    //columnType: 'varchar(2048)'
  },

  //Sdd a reference to Category
 // categories: {
   // collection: 'category',
   // via: 'owners',
   // dominant: true
  //},

  //Add a reference to Provider
 // providers: {
   // collection: 'provider',
   // via: 'owners',
   // dominant: true
  //},

  //Add a reference to File
  //files: {
    //collection: 'file',
    //via: 'owners',
    //dominant: true
  //}




}, {
  tableName: 'item'
});

module.exports = ItemCargo;