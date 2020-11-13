const express = require('express');
const router = express.Router();
const multer = require('multer');

//=================================
//             Product
//=================================
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, `${Data.now()}_${file.originalname}`)
    }
})

var upload = multer({storage: storage}).single("file");

router.post('/image', (req, res) => {
    // 가져온 이미지 저장
    upload(req, res, err => {
        if (err) {
            return req.json({success: false, err})
        }
        // res.req.file에 아무것도 존재 x 원인불명
        return res.json({success: true})
    })
});

module.exports = router;
