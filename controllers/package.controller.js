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
