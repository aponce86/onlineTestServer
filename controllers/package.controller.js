const asyncHandler = require('../middleware/asyncHandler.middleware');
const User = require('../models/user.model');
const Store = require('../models/store.model');
const Shipping = require('../models/shipping.model');
const Package = require('../models/package.model');
const Item = require('../models/item.model');
const bcrypt = require('bcrypt');

exports.createPackage = (async (req, res, next) => {

  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ msg: 'Must provide a basic authorization token' });

  if (!req.body.items) return res.status(400).json({ msg: "Param 'items' is missing" });
  if (!req.body.shipper) return res.status(400).json({ msg: "Param 'shipper' is missing" });
  if (!req.body.consignee) return res.status(400).json({ msg: "Param 'consignee' is missing" });

  if (req.body.packageType == 'E.N.A') {
    if (req.body.shipper.name != req.body.consignee.name) return res.status(400).json({ msg: 'The shipper and consignee must be the same person' });
    if (req.body.consignee.passport == '') return res.status(400).json({ msg: 'Must provide passport number' });
  } else if (req.body.packageType == 'Paqueteria') {
    if (req.body.shipper.name == req.body.consignee.name) return res.status(400).json({ msg: 'The shipper and consignee must be different person' });
  } else {
    return res.status(400).json({ msg: 'Package type value must be "E.N.A" or "Paqueteria"' });
  }

  let email;
  let password;

  try {
    const buff = Buffer.from(auth.replace('Basic ', ''), 'base64');
    const credentials = buff.toString('utf-8');
    email = credentials.split(':')[0];
    password = credentials.split(':')[1];
    if (email == undefined || password == undefined) throw new Error();
  } catch (error) {
    return res.status(401).json({ msg: 'Malformed basic authorization token' });
  }

  const user = await User.findOne({
    where: {
      emailAddress: email
    }
  });

  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const passwordChecked = bcrypt.compareSync(password, user.password);

  if (!passwordChecked) return res.status(401).json({ msg: 'Invalid credentials' });

  const store = await Store.findOne({
    where: {
      id: user.owner
    }
  });

  if (!store) return res.status(500).json({ msg: 'The current user does not have an store asociated' });

  const storeId = store.id;
  const storeName = store.name;
  const userId = user.id;
  const userFullName = user.fullName;
  const shippingType = 'Palco';

  const shipping = await Shipping.findOne({
    where: {
      status: 'Open',
      shippingType: shippingType,
      storeId: storeId
    }
  });

  if (!shipping) return res.status(400).json({
    msg: 'There is not open shipping for this shipping type "' +
      shippingType + '" and this store "' + storeName + '"'
  });

  const consignee = req.body.consignee;
  const shipper = req.body.shipper;

  let packageObj = {
    packageValue: 30,
    aduanalValue: 30,
    packageType: req.body.packageType,

    zone: 'A',
    shippingType: 'Palco',
    deliveryMode: 'Palco Recogida',
    status: "Created",

    amazon: '',
    amazonSt: 0,

    shippingNumber: shipping.noShipping,
    storeId: storeId,
    storeName: storeName,

    note: "",
    noteStatus: 0,

    ci: consignee.ci,
    passport: consignee.passport,
    province: consignee.province,
    municipality: consignee.municipality,
    street: consignee.street,
    houseNumber: consignee.houseNumber,
    between: consignee.between,
    apartment: consignee.apartment,
    nameD: consignee.name,
    lastNameD: consignee.lastName,
    consigneePhone: consignee.phone,
    neighborhood: consignee.neighborhood,

    nameR: shipper.name,
    lastNameR: shipper.lastName,
    customerPhone: shipper.phone,
    addressR: shipper.address,
    city: shipper.city,
    state: shipper.state,
    zipCode: shipper.zipCode,

    pickupDate: 0,
    userId: userId,
    userName: userFullName,
    invoiceNo: '',
    invoiceId: -1,

    cbm: 0,
    insurance: 0
  };

  const packageNumber = async () => {
    const store = await Store.findOne({ where: { id: user.owner } });
    updatedStore = await Store.update({ num: store.num + 1 }, { where: { id: store.id } });

    return 'GCT' + new Date().getFullYear() % 100 +
      store.id.toString().padStart(2, 0) + store.num.toString().padStart(6, 0);
  }

  const items = req.body.items;

  const packagesResult = [];
  const itemsResult = [];

  if (req.body.packageType == 'E.N.A') {
    let packageWeight = 0;
    let packagePrice = 0;
    let packageDescription = '';

    req.body.items.forEach(item => {
      packageWeight += item.weight;
      packagePrice += item.salePrice;
      packageDescription += item.description + '\n';
    });

    packageObj.noPackage = await packageNumber();

    Object.assign(packageObj, {
      weigth: parseFloat(packageWeight).toFixed(2),
      description: packageDescription,
      cubapackCost: parseFloat(packageWeight * 1.30).toFixed(2),
      packageCost: parseFloat(packageWeight * 1.30).toFixed(2),
      salePrice: parseFloat(packagePrice).toFixed(2),
      payCash: parseFloat(packagePrice).toFixed(2)
    });

    const createdPackage = await Package.create(packageObj);
    packagesResult.push(createdPackage);

    for (let i = 0; i < items.length; i++) {
      const itemObj = {
        owner: createdPackage.id,
        weigth: items[i].weight,
        description: items[i].description,
        cbm: 0, status: 'Created', insurance: 0
      };

      const createdItem = await Item.create(itemObj);
      itemsResult.push(createdItem);
    }

  } else {

    for (let i = 0; i < items.length; i++) {
      packageObj.noPackage = await packageNumber();

      Object.assign(packageObj, {
        weigth: parseFloat(items[i].weight).toFixed(2),
        description: items[i].description,
        cubapackCost: parseFloat(items[i].weight).toFixed(2),
        packageCost: parseFloat(items[i].weight).toFixed(2),
        salePrice: parseFloat(items[i].salePrice).toFixed(2),
        payCash: parseFloat(items[i].salePrice).toFixed(2)
      });

      const createdPackage = await Package.create(packageObj);
      packagesResult.push(createdPackage);

      const itemObj = {
        owner: createdPackage.id,
        weigth: items[i].weight,
        description: items[i].description,
        cbm: 0, status: 'Created', insurance: 0
      };

      const createdItem = await Item.create(itemObj);
      itemsResult.push(createdItem);

    }
  }

  res.status(201).json({
    packagesResult: packagesResult,
    itemsResult: itemsResult
  });
});


exports.createPackageCorreo = (async (req, res, next) => {

  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ msg: 'Must provide a basic authorization token' });

  if (!req.body.item) return res.status(400).json({ msg: "Param 'item' is missing" });
  if (!req.body.shipper) return res.status(400).json({ msg: "Param 'shipper' is missing" });
  if (!req.body.consignee) return res.status(400).json({ msg: "Param 'consignee' is missing" });

  if (req.body.shipper.name == req.body.consignee.name) return res.status(400).json({ msg: 'The shipper and consignee must be different person' });

  if (!(req.body.packageType == 'Miscelanea' || req.body.packageType == 'Duradero')) return res.status(400).json({ msg: 'Package type value must be "Miscelanea" or "Duradero"' });

  let email;
  let password;

  try {
    const buff = Buffer.from(auth.replace('Basic ', ''), 'base64');
    const credentials = buff.toString('utf-8');
    email = credentials.split(':')[0];
    password = credentials.split(':')[1];
    if (email == undefined || password == undefined) throw new Error();
  } catch (error) {
    return res.status(401).json({ msg: 'Malformed basic authorization token' });
  }

  const user = await User.findOne({
    where: {
      emailAddress: email
    }
  });

  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const passwordChecked = bcrypt.compareSync(password, user.password);

  if (!passwordChecked) return res.status(401).json({ msg: 'Invalid credentials' });

  const store = await Store.findOne({
    where: {
      id: user.owner
    }
  });

  if (!store) return res.status(500).json({ msg: 'The current user does not have an store asociated' });

  const storeId = store.id;
  const storeName = store.name;
  const userId = user.id;
  const userFullName = user.fullName;
  const shippingType = 'Correos de Cuba';

  const shipping = await Shipping.findOne({
    where: {
      status: 'Open',
      shippingType: shippingType,
      storeId: storeId
    }
  });

  if (!shipping) return res.status(400).json({
    msg: 'There is not open shipping for this shipping type "' +
      shippingType + '" and this store "' + storeName + '"'
  });

  const consignee = req.body.consignee;
  const shipper = req.body.shipper;

  const item = req.body.item;

  let packageObj = {
    packageValue: 30,
    aduanalValue: 30,
    packageType: req.body.packageType,

    zone: 'A',
    shippingType: 'Correos de Cuba',
    deliveryMode: 'Entrega',
    status: "Created",

    amazon: item.product ? item.product : "",
    amazonSt: 0,

    shippingNumber: shipping.noShipping,
    storeId: storeId,
    storeName: storeName,

    ci: consignee.ci,
    passport: consignee.passport,
    province: consignee.province,
    municipality: consignee.municipality,
    street: consignee.street,
    houseNumber: consignee.houseNumber,
    between: consignee.between,
    apartment: consignee.apartment,
    nameD: consignee.name,
    lastNameD: consignee.lastName,
    consigneePhone: consignee.phone,
    neighborhood: consignee.neighborhood,

    nameR: shipper.name,
    lastNameR: shipper.lastName,
    customerPhone: shipper.phone,
    addressR: shipper.address,
    city: shipper.city,
    state: shipper.state,
    zipCode: shipper.zipCode,

    pickupDate: 0,
    userId: userId,
    userName: userFullName,
    invoiceNo: '',
    invoiceId: -1,

    cbm: 0,
    insurance: 0
  };

  const packageNumber = async () => {
    const store = await Store.findOne({ where: { id: user.owner } });

    updatedStore = await Store.update({
      num: store.num + 1, updatedAt: new Date().getTime()
    }, { where: { id: store.id } });

    return 'CG64' + store.id.toString().padStart(2, 0) + store.num.toString().padStart(5, 0) + "MA";
  }

  packageObj.noPackage = await packageNumber();

  Object.assign(packageObj, {
    weigth: parseFloat(item.weight).toFixed(2),
    description: item.description,
    cubapackCost: parseFloat(item.weight).toFixed(2),
    packageCost: parseFloat(item.weight).toFixed(2),
    salePrice: parseFloat(item.salePrice).toFixed(2),
    payCash: parseFloat(item.salePrice).toFixed(2),
    updatedAt: new Date().getTime(),
    createdAt: new Date().getTime()
  });

  const createdPackage = await Package.create(packageObj);

  const itemObj = {
    owner: createdPackage.id,
    weigth: item.weight,
    description: item.description,
    cbm: 0, status: 'Created', insurance: 0,
    updatedAt: new Date().getTime(),
    createdAt: new Date().getTime()
  };

  const createdItem = await Item.create(itemObj);

  res.status(201).json({
    packagesResult: createdPackage,
    itemsResult: createdItem
  });

});

exports.createPackageCubanacan = (async (req, res, next) => {

  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ msg: 'Must provide a basic authorization token' });

  if (!req.body.item) return res.status(400).json({ msg: "Param 'item' is missing" });
  if (!req.body.shipper) return res.status(400).json({ msg: "Param 'shipper' is missing" });
  if (!req.body.consignee) return res.status(400).json({ msg: "Param 'consignee' is missing" });

  if (req.body.shipper.name == req.body.consignee.name) return res.status(400).json({ msg: 'The shipper and consignee must be different person' });

  if (!(req.body.packageType == 'Miscelanea' || req.body.packageType == 'Duradero')) return res.status(400).json({ msg: 'Package type value must be "Miscelanea" or "Duradero"' });

  let email;
  let password;

  try {
    const buff = Buffer.from(auth.replace('Basic ', ''), 'base64');
    const credentials = buff.toString('utf-8');
    email = credentials.split(':')[0];
    password = credentials.split(':')[1];
    if (email == undefined || password == undefined) throw new Error();
  } catch (error) {
    return res.status(401).json({ msg: 'Malformed basic authorization token' });
  }

  const user = await User.findOne({
    where: {
      emailAddress: email
    }
  });

  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

  const passwordChecked = bcrypt.compareSync(password, user.password);

  if (!passwordChecked) return res.status(401).json({ msg: 'Invalid credentials' });

  const store = await Store.findOne({
    where: {
      id: user.owner
    }
  });

  if (!store) return res.status(500).json({ msg: 'The current user does not have an store asociated' });

  const storeId = store.id;
  const storeName = store.name;
  const userId = user.id;
  const userFullName = user.fullName;
  const shippingType = 'Cubanacan';

  const shipping = await Shipping.findOne({
    where: {
      status: 'Open',
      shippingType: shippingType,
      storeId: storeId
    }
  });

  if (!shipping) return res.status(400).json({
    msg: 'There is not open shipping for this shipping type "' +
      shippingType + '" and this store "' + storeName + '"'
  });

  const consignee = req.body.consignee;
  const shipper = req.body.shipper;

  const item = req.body.item;

  let packageObj = {
    packageValue: 30,
    aduanalValue: 30,
    packageType: req.body.packageType,

    zone: 'A',
    shippingType: 'Cubanacan',
    deliveryMode: 'Cubanacan Recogida',
    status: "Created",

    amazon: item.product ? item.product : "",
    amazonSt: 0,

    shippingNumber: shipping.noShipping,
    storeId: storeId,
    storeName: storeName,

    ci: consignee.ci,
    passport: consignee.passport,
    province: consignee.province,
    municipality: consignee.municipality,
    street: consignee.street,
    houseNumber: consignee.houseNumber,
    between: consignee.between,
    apartment: consignee.apartment,
    nameD: consignee.name,
    lastNameD: consignee.lastName,
    consigneePhone: consignee.phone,
    neighborhood: consignee.neighborhood,

    nameR: shipper.name,
    lastNameR: shipper.lastName,
    customerPhone: shipper.phone,
    addressR: shipper.address,
    city: shipper.city,
    state: shipper.state,
    zipCode: shipper.zipCode,

    pickupDate: 0,
    userId: userId,
    userName: userFullName,
    invoiceNo: '',
    invoiceId: -1,

    cbm: 0,
    insurance: 0
  };

  const packageNumber = async () => {
    const store = await Store.findOne({ where: { id: user.owner } });

    updatedStore = await Store.update({
      num: store.num + 1, updatedAt: new Date().getTime()
    }, { where: { id: store.id } });

    return '181-14-' + store.id.toString().padStart(2, 0) + store.num.toString().padStart(6, 0);
  }

  packageObj.noPackage = await packageNumber();

  Object.assign(packageObj, {
    weigth: parseFloat(item.weight).toFixed(2),
    description: item.description,
    cubapackCost: parseFloat(item.weight).toFixed(2),
    packageCost: parseFloat(item.weight).toFixed(2),
    salePrice: parseFloat(item.salePrice).toFixed(2),
    payCash: parseFloat(item.salePrice).toFixed(2),
    updatedAt: new Date().getTime(),
    createdAt: new Date().getTime()
  });

  const createdPackage = await Package.create(packageObj);

  const itemObj = {
    owner: createdPackage.id,
    weigth: item.weight,
    description: item.description,
    cbm: 0, status: 'Created', insurance: 0,
    updatedAt: new Date().getTime(),
    createdAt: new Date().getTime()
  };

  const createdItem = await Item.create(itemObj);

  res.status(201).json({
    packagesResult: createdPackage,
    itemsResult: createdItem
  });

});



exports.doc = (req, res, next) => {
  const doc = `
        <html>
        <head>
            <title> Cubapack Service Doc </title>

            <style>
                p {
                    margin-left: 20px;
                }

                .space {
                    margin-left: 20px;
                }
            </style>
        </head>
            <body>
                <h1> Cubapack Micro-Service Documentation </h1>

                <h2> Endpoint </h2>

                <p> <b> URL: </b> https://cubapack-service.herokuapp.com/api/v2/package
                <p> <b> Http method: </b> POST

                <p> <b> Payload: </b> { PackageType, items, shipper, consignee }

                <br>
                <h2> Authentication </h2>

                <p> This service implement  <b> Basic Authentication Scheme </b>  which transmits credentials as email / password pairs, encoded using base64.
                Each request must include this authorization token in their headers otherwise the request will be rejected.

                <p> Example:

                <p> Having the next credentials, email: <b> example@gmail.com </b> password: <b> mystrongpassword </b> we need to concat <b> email:password </b> after that we need to encode them to base64 and concat the result with the word <b> Basic </b>

                <p> <b> example@gmail.com:mystrongpassword </b> to base64 is equal to <b> ZXhhbXBsZUBnbWFpbC5jb206bXlzdHJvbmdwYXNzd29yZA== </b>

                <p> After that we cancat the word Basic: <b> Basic ZXhhbXBsZUBnbWFpbC5jb206bXlzdHJvbmdwYXNzd29yZA== </b> and put them in the headers using the authorization scheme

                <p> <b> Authorization: Basic ZXhhbXBsZUBnbWFpbC5jb206bXlzdHJvbmdwYXNzd29yZA== </b>

                <p> Use this online tool to encode your credentials to base64: <a href="https://www.blitter.se/utils/basic-authentication-header-generator/"> https://www.blitter.se/utils/basic-authentication-header-generator/ </a>
            
                <br>
                <h2> Request payload </h2>

                <p> The payload must have 4 attributes

                <ul>
                    <li> <b> packageType </b> </li>
                    <li> <b> items </b> </li>
                    <li> <b> shipper </b> </li>
                    <li> <b> consignee </b> </li>
                </ul>

                
                <p> <b> packageType: </b> This param is an string with two possibles values: <b> E.N.A </b> or <b> Paqueteria </b>. If this attribute is missing or has different value the server response with an error {code:400, msg:'...'} 
            
                <p> Example: { packageType: 'E.N.A' } 

                <p> <b> items: </b> This param is an array of objects, each object contains 3 attributes and these attributes describe a package.
                <ul>
                    <li> <b> description: </b> String </li>
                    <li> <b> weight: </b> Number </li>
                    <li> <b> salePrice: </b> Number </li>
                </ul>

                <p> Example: 
                <b> items: </b> [
                    {
                       <b> description: </b> 'My first package description',
                       <b> weight: </b> 34.5,
                       <b> salePrice: </b> 60.2
                    },
                    {
                       <b> description: </b> 'My second package description',
                       <b> weight: </b> 10.5,
                       <b> salePrice: </b> 20.8
                    }
                ]

                <p> <b> shipper: </b> This param contains information about the person who sends packages to Cuba. Contains 7 attributes as shown below.

                <ul>
                    <li> <b> name: </b> String </li>
                    <li> <b> lastName: </b> String </li>
                    <li> <b> phone: </b> String </li>
                    <li> <b> address: </b> String </li>
                    <li> <b> city: </b> String </li>
                    <li> <b> zipCode: </b> String </li>
                    <li> <b> state: </b> String </li>
                </ul>

                <p> Example: 

               <b> shipper: </b> {
                   <b> name: </b> 'Rolando',
                   <b> lastName: </b> 'Betancourt',
                   <b> phone: </b> '786-456-2345',
                   <b> address: </b> '2950 w 5 ave',
                   <b> city: </b> 'HIALEAH',
                   <b> zipCode: </b> '33014',
                   <b> state: </b> 'Florida',
                  }

                <p> <b> consignee: </b> This param contains information about the person who receive the package in Cuba. Contains 13 attributes as shown below.
                
                <ul>
                    <li> <b> name: </b> String </li>
                    <li> <b> lastName: </b> String </li>
                    <li> <b> ci: </b> String </li>
                    <li> <b> passport: </b> String </li>
                    <li> <b> phone: </b> String </li>
                    <li> <b> homePhone: </b> String </li>
                    <li> <b> street: </b> String </li>
                    <li> <b> houseNumber: </b> String </li>
                    <li> <b> between: </b> String </li>
                    <li> <b> apartment: </b> String </li>
                    <li> <b> neighborhood: </b> String </li>
                    <li> <b> province: </b> String </li>
                    <li> <b> municipality: </b> String </li>
                </ul>

                <p> Example: 

                <b>consignee: </b> {
                   <b> name: </b> 'Zuniet',
                   <b> lastName: </b> 'Santiesteban',
                   <b> ci: </b> '93040712121',
                   <b> passport: </b> 'K67677',
                   <b> phone: </b> '53290190',
                   <b> homePhone: </b> '',
                   <b> street: </b> 'Princesa',
                   <b> houseNumber: </b> '#155',
                   <b> between: </b> '% Calvo y Soubervilles',
                   <b> apartment: </b> '',
                   <b> neighborhood: </b> '',
                   <b> province: </b> 'Matanzas',
                   <b> municipality: </b> 'Cárdenas',
                  }

                <h2> Validations </h2>

                <p> You must provide the <b>basic authorization token</b> in the headers as described earlier in this article.
                
                <p> Attributes can't be <b>null</b> or <b>undefined</b>, use ( <b>0</b> ) or ( <b>" "</b> ) instead
                
                <p> The attribute <b> packageType </b> can only take two possible values ( <b> 'E.N.A' </b> or <b> 'Paqueteria' </b> )

                <p> When the attribute <b> packageType == 'E.N.A' </b> then shipper and consignee must be the same person.

                <p> When the attribute <b> packageType == 'E.N.A' </b> then the consignee passport attribute can't be an empty string. 

                <p> When the attribute <b> packageType == 'Paqueteria' </b> then shipper and consignee must be different person.

                <h2> Server response </h2>

                <p> <b> Success: </b>

                <p> If success the server response with two arrays, the items and packages created. [ code: 201 ]

                

                <p> Example: { <b>itemsResult: [...]</b>, <b>packagesResult: [...]</b> }

               
                <p> <b> Failure: </b>

                <p> If failure the server response with an object with differents attributes related with the error. [code: 400, 401, 500]
                
                <p> Example: { <b>error:</b> { <b>msg:</b> {...} }, <b>status:</b> 400, ... }

                <p> <b>msg</b> attribute contains custom error details.

                <h2> Make an HTTP POST request using Angular </h2>

                <p> You can use the <b>authorization token</b> in the above example to create package and test your implementation.

                <br>
                <p>&nbsp;
                <p>

                <code>

  createPackage(): Observable <any> {

   <br> &nbsp; const headers = new HttpHeaders({
    <br>  &nbsp;&nbsp; Authorization: 'Basic cm9sYW5kbzA5MDJAZ21haWwuY29tOldjUmJUIzEz'
   <br>&nbsp; });

   <p>&nbsp; return this.http.post('https://cubapack-service.herokuapp.com/api/v2/package', {
    <br>&nbsp;&nbsp;  packageType: 'Paqueteria',

   <p>&nbsp;&nbsp;   items: [
    <br> &nbsp;&nbsp;&nbsp;   {
      <br>  &nbsp;&nbsp;&nbsp;&nbsp;  description: 'Freidora',
       <br> &nbsp;&nbsp;&nbsp;&nbsp;  weight: 20,
        <br> &nbsp;&nbsp;&nbsp;&nbsp; salePrice: 39.8
      <br> &nbsp;&nbsp;&nbsp; },
      <br> &nbsp;&nbsp;&nbsp; {
        <br> &nbsp;&nbsp;&nbsp;&nbsp; description: 'Bicicleta',
        <br> &nbsp;&nbsp;&nbsp;&nbsp; weight: 33,
        <br> &nbsp;&nbsp;&nbsp;&nbsp; salePrice: 65.67
      <br> &nbsp;&nbsp;&nbsp; }
     <br> &nbsp;&nbsp; ],

    <p> &nbsp;&nbsp;  consignee: {
      <br> &nbsp;&nbsp;&nbsp; name: 'Zuniet',
      <br> &nbsp;&nbsp;&nbsp; lastName: 'Santiesteban',
      <br> &nbsp;&nbsp;&nbsp; ci: '93040712121',
      <br> &nbsp;&nbsp;&nbsp; passport: 'K67677',
      <br> &nbsp;&nbsp;&nbsp; phone: '53190720',
      <br> &nbsp;&nbsp;&nbsp; homePhone: '',
      <br> &nbsp;&nbsp;&nbsp; street: 'Princesa',
      <br> &nbsp;&nbsp;&nbsp; houseNumber: '#155',
      <br> &nbsp;&nbsp;&nbsp; between: '% Calvo y Soubervilles',
      <br> &nbsp;&nbsp;&nbsp; apartment: '',
      <br> &nbsp;&nbsp;&nbsp; neighborhood: '',
      <br> &nbsp;&nbsp;&nbsp; province: 'Matanzas',
      <br> &nbsp;&nbsp;&nbsp; municipality: 'Cárdenas',
    <br> &nbsp;&nbsp; },
      
    <p> &nbsp;&nbsp; shipper: {
      <br> &nbsp;&nbsp;&nbsp; name: 'Rolando',
      <br> &nbsp;&nbsp;&nbsp; lastName: 'Betancourt',
      <br> &nbsp;&nbsp;&nbsp; phone: '7864405007',
      <br> &nbsp;&nbsp;&nbsp; address: '3920 w 6 ave',
      <br> &nbsp;&nbsp;&nbsp; city: 'HIALEAH',
      <br> &nbsp;&nbsp;&nbsp; zipCode: '33014',
      <br> &nbsp;&nbsp;&nbsp; state: 'Florida',
    <br> &nbsp;&nbsp; }
   <br> &nbsp;&nbsp;}, { 
      <br> &nbsp;&nbsp;&nbsp; headers 
   <br>&nbsp; });

 <br> }

  </code>

            </body>
        </html>
    
    `;
  res.status(200).send(doc);
};
