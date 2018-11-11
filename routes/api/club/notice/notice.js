const express = require('express');
const router = express.Router();
const jwt = require('../../../../module/jwt');
const club = require('../../../../schema/club');
const notice = require('../../../../schema/notice');

//detail라우터
const detailRouter = require('./detail');
router.use('/detail',detailRouter);




router.get('/', async (req,res,next)=>{
    let clubId = req.query.club_id;
    if(!clubId){
        res.status(400).send({
            message:"null value"
        })
        return false;
    }
    let result = await notice.find({
        club_id : clubId
    },{
        write_time: true,
        notice_category :true,
        notice_title : true,
        notice_content :true,
        _id : true
    }).sort({"write_time":1});
    if(!result){
        res.status(500).send({
            message:"Internal Server Error"
        })
    }else{
        res.status(200).send({
            message:"Success to Show list",
            data:result
        })
    }
});

module.exports = router;