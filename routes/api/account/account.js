const express = require('express');
const router = express.Router();
const user = require('../../../schema/user');
const jwt = require('../../../module/jwt');
const notice = require('../../../schema/notice');
const position = require('../../../schema/position');
const account = require('../../../schema/account');
const moment = require('moment');
const FCM = require('fcm-node');


//푸시 알람
const serverKey = require('../../../config/secretKey').push;
const fcm = new FCM(serverKey);


/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});
router.post('/',async(req,res,next)=>{

    let noticeIdx= req.body.notice_id;

    if(!noticeIdx){
        res.status(400).send({
            message:"Null value"
        })
    return false;
    }

    let tokenArr = new Array;
    let tokenData = await notice.find({_id : noticeIdx});

    let temp = {
        write_time :tokenData[0].write_time,
        notice_title : tokenData[0].notice_title,
        notice_cost : tokenData[0].notice_cost,
        notice_category : tokenData[0].notice_category,
        notice_place : tokenData[0].notice_place,
        notice_date : tokenData[0].notice_date,
        notice_time : tokenData[0].notice_time,
        notice_content : tokenData[0].notice_content,
        club_manager : tokenData[0].club_manager
    }
    console.log(temp)
    //console.log(tokenData[0].notice_people)
    let people = Array.from(tokenData[0].notice_people);


    for(let i = 0 ;i <people.length;i++){
        tokenArr.push(people[i].user_deviceToken);
    }
    //console.log(tokenArr)
    if(tokenArr.length>0){
    let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        registration_ids:tokenArr,
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: "", 
            body:"송금 메세지가 도착했습니다."  //노드로 발송하는 푸쉬 메세지
        },
    
    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
    
    };
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
            console.log(err);
            res.status(400).send({
            message:"fcm error"
            });
            return false;
        } else {
            console.log("Successfully sent with response: ", response);
            res.status(201).send({
            message:"Success to send push alram",
            data : temp
            });
        }
        });
    }
});


router.post('/transfer',async (req,res,next)=>{
    let token = req.headers.token;
    let noticeId = req.body.notice_id;
    let noticePrice = req.body.notice_price;

    let decoded = jwt.verify(token);

    if(!token || !noticeId){
        res.status(400).send({
            message:"Null Value"
        });
    }
    if(decoded === -1){
        res.status(400).send({
            message : "token error"
        })
    }
    let userName;
    await user.find({_id : decoded.id},{user_name:true},
    async function(err,outputs){
        userName = outputs[0].user_name

    });
    
    /*await account.create({
        write_time : new Date(moment().format()),
        deposit : ,
        withdraw : ,
    })*/






});

module.exports = router;