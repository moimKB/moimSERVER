const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');



router.get('/',async(req,res)=>{
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    if(decoded=== -1 || decoded === 10){
        res.status(400).send({
            message: "token error"
        })
    }
    
})


module.exports = router;