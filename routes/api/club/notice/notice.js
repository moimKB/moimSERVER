const express = require('express');
const router = express.Router();
const jwt = require('../../../../module/jwt');
const club = require('../../../../schema/club');
const notice = require('../../../../schema/notice');
const user = require('../../../../schema/user');
const position = require('../../../../schema/position');
const moment = require('moment');


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

//행사 참여
router.post('/',async(req,res,next)=>{
    //어레이리스트에 넣어줘야함
    let token = req.headers.token;
    let noticeId = req.body.notice_id;
    if(!token || !noticeId){
        res.status(400).send({
            message:"Null Value"
        });
        return false;
    }
    let decoded = jwt.verify(token);
    if(decoded === -1){
        res.status(400).send({
            message:"token error"
        });
        return false;
    }

    let output = await user.find({
        _id : decoded.id
    },{user_name : true});


    if(!output){
        res.status(500).send({
            message:"Internal Server Error"
        })
    }

    let data = {
        user_name : output[0].user_name,
        user_id : decoded.id,
        current_time : new Date(moment().format()),
        account_check : 0
    }

    console.log(data);

    await notice.update({_id :noticeId},
        {$push : {notice_people:data}},
    async function(err, outputs){
        if(err){
            res.status(500).send({
                message :"Internal Server Error"
            });
        }
    }
    );
    res.status(201).send({
        message:"success to apply event(notice)"
    })
    

});

module.exports = router;