const express = require('express');
const router = express.Router();
const jwt = require('../../../../module/jwt');
const club = require('../../../../schema/club');
const notice = require('../../../../schema/notice');


router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});


module.exports = router;