const express = require('express');
const router = express.Router();
const user = require('../../../schema/user');
const jwt = require('../../../module/jwt')


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;