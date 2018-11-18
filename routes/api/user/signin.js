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
    let deviceToken = req.body.deviceToken;

    console.log(req.body);
    let output = await user.find({user_id : id});
    if(!output){
        res.status(500).send({
            message: "Internal Server Error"
        });
        return false;
    }
    console.log(output);
    if(output.length===0){
        res.status(400).send({
            message:"Not user"
        });
        return false;
    }
    let tbPw = output[0].user_pw;
    let hashedpw = await crypto.pbkdf2(pw,output[0].user_salt, 100000, 32, 'sha512');
    if(tbPw === hashedpw.toString('base64')){
        let token = jwt.sign(output[0]._id);
        
        await user.updateOne({
            _id : output[0]._id
        },{user_deviceToken : deviceToken}
    ,async function (err,results){
        if(err){
            res.status(500).send({
                message:"Internal Server Error"
            })
        }
    });
        


        res.status(201).send({
            message:"Success to Signin",
            token : token
            });
        }else{
            res.status(400).send({
                message:"Fail to signin"
            })
            
        }
})

module.exports = router;
