const express = require('express');
const router = express.Router();

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

module.exports = router;
