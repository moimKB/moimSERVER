const express = require('express');
const router = express.Router();
const user = require('../../../schema/user');
const jwt = require('../../../module/jwt')
const account_info = require('../../../schema/account_info')

//회원가입
const SignupRouter = require('./signup');
router.use('/signup',SignupRouter);

//로그인
const SigninRouter = require('./signin');
router.use('/signin',SigninRouter);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});


router.post('/account',async(req,res,next)=>{
  let token = req.headers.token;
  let decoded = jwt.verify(token);

  if(!token){
    res.status(400).send({
      message:"Null Value"
    });
    return false;
  }
  if(decoded === -1){
    res.status(400).send({
      message:"token error"
    });
  }
  await account_info.create({
    account_bank : req.body.user_bank,
    account_number : req.body.user_account,
    user_id : decoded.id
  }, async function(err, outputs){
    if(err){
      res.status(500).send({
        message:"Internal Server Error"
      });
    }else{
      res.status(201).send({
        message:"success to make account"
      });
    }
  });

  
});

module.exports = router;
