const express = require('express');
const router = express.Router();
const user = require('../../../schema/user')
const crypto = require('crypto-promise');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});
router.post('/',async(req,res,next)=>{
    let pw = req.body.user_pw;
    const salt = await crypto.randomBytes(32);
    const hashedpw = await crypto.pbkdf2(pw, salt.toString('base64'), 100000, 32, 'sha512');

    await user.create({
        user_id : req.body.user_id,
        user_name : req.body.user_name,
        user_salt : salt.toString('base64'),
        user_pw : hashedpw.toString('base64'),
        user_phone : req.body.user_phone,
        user_sex : req.body.user_sex,
        user_birth : req.body.user_birth,
        user_univ : req.body.user_univ,
        user_major : req.body.user_major
    },
    async function(err, outputs){
        if(err){
            res.status(500).send({
                message : "Internal Server Error"
            })
        }else{
            res.status(201).send({
                message : "Success to Signup"
            })
        }
    });

})

module.exports = router;
