const express = require('express');
const router = express.Router();
const jwt = require('../../../../module/jwt');
const club = require('../../../../schema/club');
const notice = require('../../../../schema/notice');
const moment = require('moment');


router.get('/', async(req, res, next) => {
    let noticeId = req.query.notice_id;
    let output = await notice.find(
        {_id : noticeId})
        console.log(output[0].notice_people.length);
    let data ={
        
    }

});


module.exports = router;