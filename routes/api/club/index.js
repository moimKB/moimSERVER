const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');
const upload = require('../../../config/multer').uploadClubImage;
const club = require('../../../schema/club')
const position = require('../../../schema/position');
const crypto = require('crypto-promise');
const user = require('../../../schema/user');
const notice = require('../../../schema/notice');
const moment = require('moment');


//search 라우터
const searchRouter = require('./search');
router.use('/search',searchRouter);

//notice 라우터
const noticeRouter = require('./notice');
router.use('/notice',noticeRouter);

/* GET home page. */
router.get('/', async (req, res, next) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let data = new Array();
    let output;
    await position.find({
        user_id : decoded.id
    },async function( err,outputs){
        //console.log(outputs)
        
        for(let i=0; i<outputs.length;i++){
            output = await club.find({_id : outputs[i].club_id});
            if(!output){
                res.status(500).send({
                    message:"Internal Server Error"
                });
            }
            console.log(output)
            let temp = {
                club_id : output[0]._id,
                club_name : output[0].club_name,
                club_logo : output[0].club_logo,
                club_manager : output[0].club_manager,
                club_count : output[0].club_count
            }
            data.push(temp);
                console.log(data)
        }
        if(err){
            res.status(500).send({
                message:"Internal Server Error"
            })
        }else{
            res.status(200).send({
                message:"success to show myclubList",
                data : data
            })

        }

        
    });
});

router.post('/', upload.fields([{name : 'club_logo', maxCount : 1}, {name : 'club_background', maxCount : 1}]),
    async (req,res,next)=>{
        
        let token = req.headers.token;
        let decoded = jwt.verify(token);
        let clubIdx;
        let userName;
        await user.find({ _id : decoded.id },
        async function(err,outputs){
            userName = outputs[0].user_name;
            console.log(outputs)
        });

        await club.create({
            club_name : req.body.club_name,
            club_background : req.files["club_background"][0].location,
            club_logo : req.files["club_logo"][0].location,
            club_explanation : req.body.club_explanation,
            club_manager : userName,
            club_count : 1
        },
        async function(err, outputs){
            if(err){
                res.status(500).send({
                    message : "Internal Server Error"
                })
            }else{
                console.log(outputs._id);
                clubIdx = outputs._id;
                position.create({
                    user_id : decoded.id,
                    club_id : clubIdx,
                    position_category : 0
                },function(err,results){
                    if(err){
                        res.status(500).send({
                            message : "Internal Server Error"
                        })
                    }
                    res.status(201).send({
                        message : "Success to create club"
                    })
                })
                
            }
        });
});
router.get('/detail',async(req,res,next)=>{
    let clubIdx = req.query.club_id;
    let cluboutput = await club.find({_id : clubIdx});
    let temp;
    let dataArray = new Array;
    if(!cluboutput){
        res.status(500).send({
            message:"Internal Server Error"
        })
    }

    let clubData = {
        club_id : cluboutput[0]._id,
        club_logo : cluboutput[0].club_log,
        club_background : cluboutput[0].club_background,
        club_title : cluboutput[0].club_title,
        club_explanation : cluboutput[0].club_explanation
    }

    let noticeoutput = await notice.find({club_id : clubIdx}).sort({"write_time":1});
    if(!noticeoutput){
        res.status(500).send({
            message : "Internal Server Error"
        })
    }
    let noticeTotalData ={
        notice_title : noticeoutput[0].notice_title,
        notice_content : noticeoutput[0].notice_content,
        notice_category : noticeoutput[0].notice_category,
        notice_id : noticeoutput[0]._id
    }

    let noticeoutput2 = await notice.find({$and:[{club_id : clubIdx},
        {notice_date:{$gte:new Date(moment().format())}}]}).sort({"notice_date":-1});
    let day = new Date(noticeoutput2[0].notice_date)
    
    
    let data2 =  {
        notice_title : noticeoutput2[0].notice_title,
        notice_date : noticeoutput2[0].notice_date,
        notice_time : noticeoutput2[0].notice_time,
        notice_day : day.getDay()
    }
    

    if(!noticeoutput2){
        res.status(500).send({
            message :"Internal Server Error"
        })
    }
    res.status(200).send({
        message:"Success to showing club Detail",
        data : {
            clubInfo : clubData,
            noticeschedule : data2,
            totalNotice : noticeTotalData
        }
    })


});



module.exports = router;
