const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({storage: storage}).single("file");

router.post('/image', (req, res) => {
    // 가져온 이미지 저장
    upload(req, res, err => {
        if (err) {
            return req.json({success: false, err})
        }
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename})
    })
});

router.post('/', (req, res) => {
    // 받아온 정보들을 DB에 넣어줌
    console.log(req.body);
    const product = new Product(req.body);
    product.save((err) => {
        if(err) return res.status(400).json({success:false, err});
        return res.status(200).json({success:true});
    });
});

router.post('/products', (req, res) => {
    // mongodb 제한하기
    // skip : 몇번째부터 가져올지, limit : 몇개까지 가져올지
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm;
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    // mongodb 문법 (~이상 ~ 이하)
                    // greater then equal
                    $gte: req.body.filters[key][0],
                    // less then equal
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    if (term) {
        Product.find(findArgs)
        // mongodb 문법 => find
        .find({$text: {$search: term}})
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if (err) return res.status(400).json({success: false, err});
            return res.status(200).json({success: true, productInfo, postSize:productInfo.length});
        })
    } else {
        Product.find(findArgs)
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if (err) return res.status(400).json({success: false, err});
            return res.status(200).json({success: true, productInfo, postSize:productInfo.length});
        })
    }
})

router.get('/product_by_id', (req, res) => {
    let type = req.query.type;
    let productIds = req.query.id;

    if (type === "array") {
        let ids = req.query.id.split(',');
        productIds = ids.map(item => {
            return item;
        })
    }

    Product.find({_id: {$in: productIds}})
    .populate('writer')
    .exec((err, product) => {
        if(err) return res.status(400).send({success: false, err});
        return res.status(200).send(product);
    })
});

module.exports = router;
