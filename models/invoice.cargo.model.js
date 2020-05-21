const sequalizeCargo = require('../util/database.cargo');

const { DataTypes } = require('sequelize');

const InvoiceCargo = sequalizeCargo.define('Invoice',{

  noInvoice: {
    type: DataTypes.STRING
    //required: true,
    //unique: true
  },

  // Created, Dispatched
  status: {
    type: DataTypes.STRING
    //required: true
  },

  saleOnline: {
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

  //  Pending, Paid
  paidOut: {
    type: DataTypes.NUMBER
    //required: true
  },

  tax: {
    type: DataTypes.NUMBER
    //required: true
  },

  shipping: {
    type: DataTypes.NUMBER
    //required: true
  },

  payInCash: {
    type: DataTypes.NUMBER
    //required: true
  },

  payInCard: {
    type: DataTypes.NUMBER
    //required: true
  },

  bankTransaction: {
    type: DataTypes.STRING
    //required: true
  },

  subsidiaryName: {
    type: DataTypes.STRING
    //required: true
  },

  subsidiaryId: {
    type: DataTypes.NUMBER
    //required: true
  },

  userName: {
    type: DataTypes.STRING
    //required: true
  },

  userFullName: {
    type: DataTypes.STRING
    //required: true
  },

  clientDiscount: {
    type: DataTypes.NUMBER
    //required: true
  },

  clientName: {
    type: DataTypes.STRING
    //required: true
  },

  clientMail: {
    type: DataTypes.STRING
    //required: true
  },

  clientPhone: {
    type: DataTypes.STRING
    //required: true
  },

  clientId: {
    type: DataTypes.NUMBER
   //required: true
  },
  deliveryMode: {
    type: DataTypes.STRING
    //required: true
  },
  estimateDrop: {
    type: DataTypes.STRING
    //required: true
  },
  consigneeId: {
    type: DataTypes.NUMBER
    //required: true
  },
  consigneeFullName: {
    type: DataTypes.STRING
    //required: true
  },
  consigneeAddreess: {
    type: DataTypes.STRING
   //required: true
  },
  consigneeCi: {
    type: DataTypes.STRING
    //required: true
  },
  consigneePhone: {
    type: DataTypes.STRING
    //required: true
  },
  consigneeProvince: {
    type: DataTypes.STRING
    //required: true
  },
  consigneeMunicipality: {
    type:DataTypes.STRING
   // required: true
  },
  updatedAt: {
    type: DataTypes.NUMBER
  },
  createdAt: {
    type: DataTypes.NUMBER
  }


}, {
  tableName: 'invoice',
  timestamps: false
});

module.exports = InvoiceCargo;