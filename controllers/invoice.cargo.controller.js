const asyncHandler = require('../middleware/asyncHandler.middleware');
const InvoiceCargo = require('../models/invoice.cargo.model');
const InvoiceItemCargo = require('../models/invoiceItem.cargo.model');
const ItemSubsidiaryCargo = require('../models/itemSubsidiary.cargo.model');
const ItemCargo = require('../models/item.cargo.model');

exports.getInvoiceByNumber = asyncHandler(async (req, res, next) => {
  const invoice = await InvoiceCargo.findOne({
    where: { noInvoice: req.params.num }
  });

  let invoiceItems;

  if (invoice) {
    invoiceItems = await InvoiceItemCargo.findAll({
      where: { owner: invoice.id }
    });
  }

  return res.status(200).json({ invoice: invoice, invoiceItems: invoiceItems });
});

exports.getInvoiceByClientId = asyncHandler(async (req, res, next) => {
  const invoices = await InvoiceCargo.findAll({
    where: { clientId: req.params.clientId }
  });
  return res.status(200).json({ invoices: invoices });
});

exports.createInvoice = asyncHandler(async (req, res, next) => {

  //console.log(req.body.packages);

  console.log('Package size *******');
  console.log(req.body.packages.length);

  //console.log( JSON.parse(req.body.packages));

  let packages = JSON.parse(req.body.packages);


  let resultList = [];

  for (let index = 0; index < packages.length; index++) {

    let itemPartNumberScanned;



    if (packages[index].product && packages[index].product.scannedBarCode) {


      if (packages[index].amazonOrd === '') {

        itemPartNumberScanned = packages[index].product.scannedBarCode.split('\n');

        let itemPartNumbersMap = {};

        itemPartNumberScanned.forEach(c => {
          if (itemPartNumbersMap[c]) {
            itemPartNumbersMap[c]++;
          } else {
            itemPartNumbersMap[c] = 1;
          }
        });


        ////////////////////////////////////////////////////
        console.log(itemPartNumbersMap);
        //let itemPartNumbersMap = JSON.parse(req.body.codes);

        let items = await ItemCargo.findAll({
          where: { itemPartNumber: Object.keys(itemPartNumbersMap) }
        })

        let itemIdsMap = {};

        let itemIds = items.map(v => {
          itemIdsMap[v.dataValues.itemPartNumber.toString()] = v.dataValues.id;
          return v.dataValues.id;
        });

        let itemsSub = await ItemSubsidiaryCargo.findAll({
          where: {
            item: itemIds,
            subsidiary: req.body.subId
          }
        });

        let itemExistingMap = {};
        let itemLocationMap = {};
        let itemSUbsiduary = {};
        itemsSub.map(v => {
          itemExistingMap[v.dataValues.item] = v.dataValues.count;
          itemLocationMap[v.dataValues.item] = v.dataValues.itemLocation;
          itemSUbsiduary[v.dataValues.id] = v.dataValues.itemPartNumber;
          return v.dataValues.count;
        });

        resultMap = {};

        for (let [k, v] of Object.entries(itemIdsMap)) {
          resultMap[k] = { count: itemPartNumbersMap[k], available: itemExistingMap[v] }
        }


        console.log('******************');
        console.log(itemPartNumbersMap);
        console.log(resultMap);



        if (Object.keys(resultMap).length !== Object.keys(itemPartNumbersMap).length) {


          console.log('Invalid asdads');

          resultList.push({ invalid: 'Invalid Product' });
          //return res.status(200).json({ invalid: 'Invalid Product' });
        }







        if (!Object.values(resultMap).some(v => v.count > v.available)) {

          // TODO: complete invoice creation here
          console.log('can create invoice');
          console.log(resultMap);
          console.log('************************** loko    *******');

          //console.log(items);

          let amount = items.reduce((a, c) => a + c.dataValues.itemSalePrice * resultMap[c.dataValues.itemPartNumber].count, 0);
          // console.log(amount);

          let date = new Date().getTime();

          let invoiceObj = {
            noInvoice: 'INV' + Date.now().toString().slice(5, 13),
            status: "Created",
            note: "",
            noteStatus: 0,
            paidOut: 1,
            tax: 0,
            shipping: 0,
            payInCash: parseFloat(amount).toFixed(2),
            payInCard: 0,
            bankTransaction: "none",
            subsidiaryName: "GlobalCargo",
            userName: "cubaonline@gmail.com",
            userFullName: "Cuba Online",
            clientDiscount: 0,
            clientName: "Venta 2349 sin delivery",
            clientMail: "3058880700@gmail.com",
            clientPhone: "3058880700",
            saleOnline: 0,
            clientId: 3,
            consigneeId: 5215,
            consigneeFullName: "Venta 2349sin delivery",
            consigneeAddreess: "N/A",
            consigneeCi: "11111111111",
            consigneePhone: "3058880700/",
            consigneeProvince: "Florida",
            consigneeMunicipality: "Miami",
            subsidiaryId: 41,
            estimateDrop: "No Shipping",
            deliveryMode: "Florida",
            updatedAt: date,
            createdAt: date
          };

          //console.log(invoiceObj);

          let newInvoice = await InvoiceCargo.create(invoiceObj);

          //  console.log(newInvoice.dataValues);




          let invoiceItems = [];

          console.log(resultMap);

          items.map(v => {
            invoiceItems.push({
              itemType: v.dataValues.itemName,
              itemBrand: v.dataValues.itemBrand,
              itemPartNumber: v.dataValues.itemPartNumber,
              itemShortDescription: v.dataValues.itemShortDescription,
              itemWeight: v.dataValues.itemWeight,
              itemCount: resultMap[v.dataValues.itemPartNumber].count,
              itemSalePrice: v.dataValues.itemSalePrice,
              itemCost: v.dataValues.itemProviderCost,
              providerShipping: v.dataValues.itemProviderShipping,
              owner: newInvoice.dataValues.id,
              img: v.dataValues.img,
              itemLocation: itemLocationMap[v.dataValues.id],
              noInvoice: invoiceObj.noInvoice,
              clientName: "Venta 2349 sin delivery",
              itemId: v.dataValues.id,
              updatedAt: date,
              createdAt: date
            });
          });

          for (let i = 0; i < invoiceItems.length; i++) {
            let newInvoiceitems = await InvoiceItemCargo.create(invoiceItems[i]);
            //   console.log(newInvoiceitems.dataValues);
          }

          //console.log(itemsSub.map(v => { v.dataValues.id, v.dataValues.itemPartNumber }));
          console.log(itemPartNumbersMap);
          console.log(itemExistingMap);
          console.log(resultMap);
          console.log(itemLocationMap);
          console.log(itemSUbsiduary);

          for (let [k, v] of Object.entries(itemSUbsiduary)) {
            //console.log(k);
            //console.log(v);
            // console.log(resultMap[v]);
            // console.log(resultMap[v].available - resultMap[v].count);

            let result = await ItemSubsidiaryCargo.update({ count: resultMap[v].available - resultMap[v].count }, {
              where: { id: k }
            });

            console.log(result);
          }

         
          //console.log(invoiceItems);

          newInvoice.dataValues.invoiceItem=invoiceItems;

          resultList.push({ invoice: newInvoice.dataValues, noPackage: packages[index].noPackage });

        //  return res.status(201).json({ invoice: newInvoice.dataValues, noPackage: packages[index].noPackage });

        } else {

          console.log('Out of stock adsda sdasdasd');


          let outOfStock = [];

          Object.keys(resultMap).map(v => {
            if (resultMap[v].count > resultMap[v].available) {
              items.forEach(item => {
                if (item.dataValues.itemPartNumber == v) {
                  item.dataValues.count = resultMap[v].count;
                  item.dataValues.available = resultMap[v].available;
                  outOfStock.push(item.dataValues);
                }
              });
            }
          });

          console.log(outOfStock);

          resultList.push({ out: outOfStock, noPackage: packages[index].noPackage })
          //return res.status(200).json({ out: outOfStock, noPackage: packages[index].noPackage });
        }








      } else {
        resultList.push({hasInvoice: 'This package already has an invoice'});
          console.log('has invoice');
      }




    } else {
      resultList.push({isAmazon: 'This package already has an amazon invoice'});
        console.log('amazon package ');
    }


  }



  return res.status(201).json({ result: resultList });


  /*
  let itemPartNumbersMap = JSON.parse(req.body.codes);

  let items = await ItemCargo.findAll({
    where: { itemPartNumber: Object.keys(itemPartNumbersMap) }
  })

  let itemIdsMap = {};

  let itemIds = items.map(v => {
    itemIdsMap[v.dataValues.itemPartNumber.toString()] = v.dataValues.id;
    return v.dataValues.id;
  });

  let itemsSub = await ItemSubsidiaryCargo.findAll({
    where: {
      item: itemIds,
      subsidiary: req.body.subId
    }
  });

  let itemExistingMap = {};
  let itemLocationMap = {};
  let itemSUbsiduary = {};
  itemsSub.map(v => {
    itemExistingMap[v.dataValues.item] = v.dataValues.count;
    itemLocationMap[v.dataValues.item] = v.dataValues.itemLocation;
    itemSUbsiduary[v.dataValues.id] = v.dataValues.itemPartNumber; 
    return v.dataValues.count;
  });

  resultMap = {};

  for (let [k, v] of Object.entries(itemIdsMap)) {
    resultMap[k] = { count: itemPartNumbersMap[k], available: itemExistingMap[v] }
  }

  
  console.log('******************');
  console.log(itemPartNumbersMap);
  console.log(resultMap);

  

  if(Object.keys(resultMap).length !== Object.keys(itemPartNumbersMap).length){


    console.log('Invalid asdads');

    return res.status(200).json({ invalid: 'Invalid Product' });
  }

  





  if (!Object.values(resultMap).some(v => v.count > v.available)) {

    // TODO: complete invoice creation here
    console.log('can create invoice');
    console.log(resultMap);
    console.log('************************** loko    *******');

    //console.log(items);

    let amount = items.reduce((a, c) => a + c.dataValues.itemSalePrice * resultMap[c.dataValues.itemPartNumber].count, 0);
    // console.log(amount);

    let date = new Date().getTime();

    let invoiceObj = {
      noInvoice: 'INV' + Date.now().toString().slice(5, 13),
      status: "Created",
      note: "",
      noteStatus: 0,
      paidOut: 1,
      tax: 0,
      shipping: 0,
      payInCash: parseFloat(amount).toFixed(2),
      payInCard: 0,
      bankTransaction: "none",
      subsidiaryName: "GlobalCargo",
      userName: "cubaonline@gmail.com",
      userFullName: "Cuba Online",
      clientDiscount: 0,
      clientName: "Venta 2349 sin delivery",
      clientMail: "3058880700@gmail.com",
      clientPhone: "3058880700",
      saleOnline: 0,
      clientId: 3,
      consigneeId: 5215,
      consigneeFullName: "Venta 2349sin delivery",
      consigneeAddreess: "N/A",
      consigneeCi: "11111111111",
      consigneePhone: "3058880700/",
      consigneeProvince: "Florida",
      consigneeMunicipality: "Miami",
      subsidiaryId: 41,
      estimateDrop: "No Shipping",
      deliveryMode: "Florida",
      updatedAt: date,
      createdAt: date
    };

    //console.log(invoiceObj);

    let newInvoice = await InvoiceCargo.create(invoiceObj);

  //  console.log(newInvoice.dataValues);




    let invoiceItems = [];

    console.log(resultMap);

    items.map(v => {
      invoiceItems.push({
        itemType: v.dataValues.itemName,
        itemBrand: v.dataValues.itemBrand,
        itemPartNumber: v.dataValues.itemPartNumber,
        itemShortDescription: v.dataValues.itemShortDescription,
        itemWeight: v.dataValues.itemWeight,
        itemCount: resultMap[v.dataValues.itemPartNumber].count,
        itemSalePrice: v.dataValues.itemSalePrice,
        itemCost: v.dataValues.itemProviderCost,
        providerShipping: v.dataValues.itemProviderShipping,
        owner: newInvoice.dataValues.id,
        img: v.dataValues.img,
        itemLocation: itemLocationMap[v.dataValues.id],
        noInvoice: invoiceObj.noInvoice,
        clientName: "Venta 2349 sin delivery",
        itemId: v.dataValues.id,
        updatedAt: date,
        createdAt: date
      });
    });

    for (let i = 0; i < invoiceItems.length; i++) {
      let newInvoiceitems = await InvoiceItemCargo.create(invoiceItems[i]);
   //   console.log(newInvoiceitems.dataValues);
    }

    //console.log(itemsSub.map(v => { v.dataValues.id, v.dataValues.itemPartNumber }));
    console.log(itemPartNumbersMap);
    console.log(itemExistingMap);
    console.log(resultMap);
    console.log(itemLocationMap);
    console.log(itemSUbsiduary);

    for(let [k, v] of Object.entries(itemSUbsiduary)){
      //console.log(k);
      //console.log(v);
     // console.log(resultMap[v]);
     // console.log(resultMap[v].available - resultMap[v].count);

      let result = await ItemSubsidiaryCargo.update({ count: resultMap[v].available - resultMap[v].count }, {
        where: { id: k }
      });

      console.log(result);
    }

    
    //console.log(invoiceItems);




    return res.status(201).json({ invoice: newInvoice.dataValues });

  } else {

    console.log('Out of stock adsda sdasdasd');


    let outOfStock = [];

    Object.keys(resultMap).map(v => {
      if (resultMap[v].count > resultMap[v].available) {
        items.forEach(item => {
          if (item.dataValues.itemPartNumber == v) {
            item.dataValues.count = resultMap[v].count;
            item.dataValues.available = resultMap[v].available;
            outOfStock.push(item.dataValues);
          }
        });
      }
    });

    console.log(outOfStock);

    return res.status(200).json({ out: outOfStock });
  }
  */

});


