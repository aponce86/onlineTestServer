const sequelize = require('../util/database');
const { DataTypes } = require('sequelize');



const Package = sequelize.define('Package', {
  noPackage: DataTypes.STRING,
  weigth: DataTypes.NUMBER,
  packageValue: DataTypes.NUMBER,
  aduanalValue: DataTypes.NUMBER,
  packageType: DataTypes.STRING,

  description: DataTypes.STRING,
  zone: DataTypes.STRING,
  shippingType: DataTypes.STRING,
  deliveryMode: DataTypes.STRING,
  status: DataTypes.STRING,

  note: { 
    type: DataTypes.STRING, 
    defaultValue: "" 
  },

  noteStatus: { 
    type: DataTypes.TINYINT, 
    defaultValue: 0 
  },

  amazon: {
    type: DataTypes.STRING,
    defaultValue: ""
  },
  amazonSt: {
    type: DataTypes.NUMBER,
    defaultValue: 0
  },
  amazonOrd: {
    type: DataTypes.STRING,
    defaultValue: ""
  },

  cubapackCost: DataTypes.NUMBER,
  packageCost: DataTypes.NUMBER,
  salePrice: DataTypes.NUMBER,

  shippingNumber: DataTypes.STRING,
  storeId: DataTypes.NUMBER,
  storeName: DataTypes.STRING,

  ci: DataTypes.STRING,
  passport: DataTypes.STRING,
  province: DataTypes.STRING,
  municipality: DataTypes.STRING,
  street: DataTypes.STRING,
  houseNumber: DataTypes.STRING,
  between: DataTypes.STRING,
  apartment: DataTypes.STRING,
  nameD: DataTypes.STRING,
  lastNameD: DataTypes.STRING,
  consigneePhone: DataTypes.STRING,
  neighborhood: DataTypes.STRING,

  nameR: DataTypes.STRING,
  lastNameR: DataTypes.STRING,
  customerPhone: DataTypes.STRING,
  addressR: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zipCode: DataTypes.STRING,

  pickupDate: DataTypes.NUMBER,
  userId: DataTypes.NUMBER,
  userName: DataTypes.STRING,
  payCash: DataTypes.NUMBER,
  invoiceNo: DataTypes.STRING,
  invoiceId: DataTypes.NUMBER,

  cbm: DataTypes.NUMBER,
  insurance: DataTypes.NUMBER,

  updatedAt: DataTypes.TIME,
  createdAt: DataTypes.TIME

}, {
  tableName: 'package'
});

module.exports = Package;