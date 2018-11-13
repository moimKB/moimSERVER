const express = require('express');
const router = express.Router();
//유저 라우터
const userRouter = require('./user/index');
router.use('/user',userRouter);

//동아리 라우터
const clubRouter = require('./club/index');
router.use('/club',clubRouter);

//계좌 라우터
const accountRouter = require('./account/account');
router.use('/account',accountRouter);


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
