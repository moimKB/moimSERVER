const express = require('express');
const router = express.Router();
const user = require('../../../schema/user')
const crypto = require('crypto-promise');
const jwt = require('../../../module/jwt');
/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

router.post('/', async(req,res,next)=>{
    let pw = req.body.user_pw;
    let id = req.body.user_id;
    console.log(req.body);
    await user.find({
        user_id : id
    },
    async function(err,result){
        if(err){
            res.status(500).send({
                message:"Internal Server Error"
            });
        }else{
            
            let tbPw = result[0].user_pw;
            let hashedpw = await crypto.pbkdf2(pw,result[0].user_salt, 100000, 32, 'sha512');
            if(tbPw === hashedpw.toString('base64')){
                let token = jwt.sign(result[0]._id);
                
                res.status(201).send({
                    message:"Success to Signin",
                    token : token
                });
            }
        }
    }
);

})

module.exports = router;
