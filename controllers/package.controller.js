const asyncHandler = require('../middleware/asyncHandler.middleware');
const User = require('../models/user.model');
const Store = require('../models/store.model');
const bcrypt = require('bcrypt');

exports.createPackage = (async (req, res, next) => {

    const auth = req.headers.authorization;

    if (!auth) return res.status(401).json({ msg: 'Must provide a basic authorization token' });

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

    if (!req.body.items) return res.status(500).json({ msg: "Attribute 'items' is missing" });

    let packageWeight = 0;
    let packagePrice = 0;
    let packageDescription = '';

    req.body.items.forEach(item => {
        packageWeight += item.weight;
        packagePrice += item.salePrice;
        packageDescription += item.description; 
    });

    const storeId = store.id;
    const storeName = store.name;

    const userId = user.id;
    const userEmail = user.emailAddress;
    const userFullName = user.fullName;

    const deliveryMode = 'Palco Recogida';
    const shippingType = 'Palco';
    const zone = 'A'

    await Store.update({ num: store.num + 1 }, {
        where: {
            id: store.id
        }
    });

    const packageNumber = 'GCT' + new Date().getFullYear() % 100 +
        store.id.toString().padStart(2, 0) + store.num.toString().padStart(6, 0);


    console.log(req.body);

    console.log(packageNumber);

    console.log(packageWeight, packagePrice);

    //let shippingNo = await Shipping.find({ status: 'Open', shippingType: data.shippingType, storeId: storeId });




    /*

    let packageObj = {
        noPackage: packageNumber,
        weigth: parseFloat(packageWeight).toFixed(2),
        packageValue: 30,
        aduanalValue: 30,
        packageType: packageType,
    
        description: packageDescription,
        zone: 'A',
        shippingType: 'Palco',
        deliveryMode: 'Palco Recogida',
        status: "Created",
    
        amazon:  '', 
        amazonSt: 0,
    
        cubapackCost: parseFloat(packageWeight * 1.30).toFixed(2),
        packageCost: parseFloat(packageWeight * 1.30).toFixed(2),
        salePrice:  parseFloat(packagePrice).toFixed(2),   
        ///////////////////////////

        shippingNumber:  use method  //shippingNo[0].noShipping,
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
        payCash:  price  //data.cartItems[i].itemSalePrice,
        invoiceNo:  '' //invoice.noInvoice,
        invoiceId: -1 //invoice.id,
    
        cbm: 0,
        insurance: 0
    }

    */





    res.send({ name: 'zuny linda' });
});

//MMS1
/*

{
  data: '{"amount":"103.48","tax":"0.00","deliveryMode":"Palco Recogida","shippingType":"Palco","packageType":"Paqueteria","zone":"B"}',
  packages: '[{"errDescript":false,"id":2,"description":"timon de carro","weigth":"22","length":0,"width":0,"height":0,"cbm":0,"rapping":0,"insurance":0,"costByPound":[2.49,1.99,1.75,1.65,1.5],"cost":1.99,"total":"43.78","cubapackCost":"24.20","packageCost":"24.20","salePrice":"43.78"},{"errDescript":false,"id":1,"description":"silla electrica","weigth":"30","length":0,"width":0,"height":0,"cbm":0,"rapping":0,"insurance":0,"costByPound":[2.49,1.99,1.75,1.65,1.5],"cost":1.99,"total":"59.70","cubapackCost":"33.00","packageCost":"33.00","salePrice":"59.70"}]',
  shipper: '{"createdAt":1587047950546,"updatedAt":1587047950546,"id":5432,"emailAddress":"rolando09021986@gmail.com","password":"$2a$10$xeEuC8aqlohGUFyxm1IkMOjUbXJ5ICwAr3BEMYB7kY1bFPC9dtX7u","name":"Rolando","lastName":"Betancourt","country":"USA","isSuperAdmin":false,"passwordResetToken":"","passwordResetTokenExpiresAt":0,"stripeCustomerId":"","hasBillingCard":false,"billingCardBrand":"","billingCardLast4":"","billingCardExpMonth":"","billingCardExpYear":"","emailProofToken":"","emailProofTokenExpiresAt":0,"emailStatus":"confirmed","emailChangeCandidate":"","tosAcceptedByIp":"","lastSeenAt":1502844074211,"phone":"7864705107","address":"6950 w 6 ave","city":"HIALEAH","zipCode":"33014","state":"Florida","payInStore":1,"subId":31}',
  consignee: '{"createdAt":1587048018406,"updatedAt":1587048018406,"id":5205,"name":"Zuniet","lastName":"Santiesteban","ci":"93040712121","passport":"","phone":"53490790","homePhone":"","street":"Princesa","houseNumber":"#155","between":"% Calvo y Soubervilles","apartment":"","neighborhood":"","province":"Matanzas","municipality":"Cárdenas","clientId":0,"subId":31}'
}



*/

/*

let obj = {
    noPackage: noPackage,
    weigth: // Suma todos los items// parseFloat(data.cartItems[i].itemWeight).toFixed(2),
    packageValue: 30,
    aduanalValue: 30,
    packageType: 'Paqueteria', // or ENA

    description: // Concatenaciontodas desc// data.cartItems[i].itemName,
    zone: 'A',
    shippingType: 'Palco',
    deliveryMode: 'Palco Recogida',
    status: "Created",

    amazon:  '' ///data.cartItems[i].itemProviderReference,
    amazonSt:0,

    cubapackCost: weight * 1.30    // parseFloat(data.cartItems[i].itemWeight*1.99).toFixed(2),
    packageCost: weight * 1.30  //parseFloat(data.cartItems[i].itemProviderCost+data.cartItems[i].itemProviderShipping).toFixed(2),
    salePrice:  request   // parseFloat(data.cartItems[i].itemSalePrice).toFixed(2),
    shippingNumber:  use method  //shippingNo[0].noShipping,
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
    payCash:  price  //data.cartItems[i].itemSalePrice,
    invoiceNo:  '' //invoice.noInvoice,
    invoiceId: -1 //invoice.id,

    cbm: 0,
    insurance: 0
}

*/

const items = [
    {
        //errDescript: false,
        //id: 2,
        description: 'timon de carro',
        weigth: '22',
        //length: 0,
        //width: 0,
        //height: 0,
        //cbm: 0,
        //rapping: 0,
        //insurance: 0,
        //costByPound: [2.49, 1.99, 1.75, 1.65, 1.5],
        //cost: 1.99,
        //total: '43.78',
        //cubapackCost: '24.20',
        //packageCost: '24.20',
        salePrice: '43.78'
    },
    {
        errDescript: false,
        id: 1,
        description: 'silla electrica',
        weigth: '30',
        length: 0,
        width: 0,
        height: 0,
        cbm: 0,
        rapping: 0,
        insurance: 0,
        costByPound: [2.49, 1.99, 1.75, 1.65, 1.5],
        cost: 1.99,
        total: '59.70',
        cubapackCost: '33.00',
        packageCost: '33.00',
        salePrice: '59.70'
    }
];

const shipper = {
    createdAt: 1587047950546,
    updatedAt: 1587047950546,
    id: 5432,
    emailAddress: 'rolando09021986@gmail.com',
    password: '$2a$10$xeEuC8aqlohGUFyxm1IkMOjUbXJ5ICwAr3BEMYB7kY1bFPC9dtX7u',
    name: 'Rolando',
    lastName: 'Betancourt',
    country: 'USA',
    isSuperAdmin: false,
    passwordResetToken: '',
    passwordResetTokenExpiresAt: 0,
    stripeCustomerId: '',
    hasBillingCard: false,
    billingCardBrand: '',
    billingCardLast4: '',
    billingCardExpMonth: '',
    billingCardExpYear: '',
    emailProofToken: '',
    emailProofTokenExpiresAt: 0,
    emailStatus: 'confirmed',
    emailChangeCandidate: '',
    tosAcceptedByIp: '',
    lastSeenAt: 1502844074211,
    phone: '7864705107',
    address: '6950 w 6 ave',
    city: 'HIALEAH',
    zipCode: '33014',
    state: 'Florida',
    payInStore: 1,
    subId: 31
};

const consignee = {
    createdAt: 1587048018406,
    updatedAt: 1587048018406,
    id: 5205,
    name: 'Zuniet',
    lastName: 'Santiesteban',
    ci: '93040712121',
    passport: '',
    phone: '53490790',
    homePhone: '',
    street: 'Princesa',
    houseNumber: '#155',
    between: '% Calvo y Soubervilles',
    apartment: '',
    neighborhood: '',
    province: 'Matanzas',
    municipality: 'Cárdenas',
    clientId: 0,
    subId: 31
};

/*
const data = {
    amount: '103.48',
    tax: '0.00',
     deliveryMode: 'Palco Recogida',
     shippingType: 'Palco',
     packageType: 'Paqueteria',
    zone: 'B'
};
*/