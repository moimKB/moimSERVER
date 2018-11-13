const express = require('express');
const router = express.Router();
const user = require('../../../schema/user');
const jwt = require('../../../module/jwt')

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
router.put('/account',async (req,res,next)=>{
  let account = req.body.user_account;
  let bank = req.body.user_bank;
  let token = req.headers.token;
  if(!token){
    res.status(400).send({
      message:"no token"
    })
  }
  let decoded = jwt.verify(token);
  if(decoded === -1){
    res.status(400).send({
      message:"token error"
    })
  }
  if(!account || !bank){
    res.status(400).send({
      message:"Null value"
    })
  }

  await user.updateOne({_id:decoded.id},{
    user_account : account,
    user_bank  : bank
  },async function(err, output){
    if(err){
      res.status(500).send({
        message:"Internal Server Error"
      })
    }else{
      res.status(201).send({
        message:"success to update user's account"
      });
    }
  })


});

module.exports = router;
