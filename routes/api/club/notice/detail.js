const express = require('express');
const router = express.Router();
const jwt = require('../../../../module/jwt');
const club = require('../../../../schema/club');
const notice = require('../../../../schema/notice');
const moment = require('moment');


router.get('/', async(req, res, next) => {
    let noticeId = req.query.notice_id;
    let output = await notice.find(
        {_id : noticeId});
    if(!output){
        res.status(500).send({
            message:"Internal Server Error"
        });
    }
    
    let club_manager = await club.find({
        _id : output[0].club_id
    },{club_manager : true});

    if(!club_manager){
        res.status(500).send({
            message:"Internal Server Error"
        });
    }

    let data = {
        write_time : output[0].write_time,
        notice_title : output[0].notice_title,
        notice_cost : output[0].notice_cost,
        notice_category : output[0].notice_category,
        notice_date : output[0].notice_date,
        notice_time : output[0].notice_time,
        club_manager : club_manager[0].club_manager,
        notice_participant : output[0].notice_people.length,
        notice_people :  output[0].notice_people
    }
    
    res.status(200).send({
        message:"success to show detail notice",
        data : data
    });
});


module.exports = router;