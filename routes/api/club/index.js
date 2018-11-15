const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');
const upload = require('../../../config/multer').uploadClubImage;
const club = require('../../../schema/club')
const position = require('../../../schema/position');
const crypto = require('crypto-promise');
const user = require('../../../schema/user');
const notice = require('../../../schema/notice');
const account = require('../../../schema/account');
const account_info = require('../../../schema/account_info');
const moment = require('moment');


//search 라우터
const searchRouter = require('./search');
router.use('/search',searchRouter);

//notice 라우터
const noticeRouter = require('./notice/notice');
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


        
        for(let i=0; i<outputs.length;i++){
            output = await club.find({_id : outputs[i].club_id});
            if(!output){
                res.status(500).send({
                    message:"Internal Server Error"
                });
                return false;
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
            console.log("1234");
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
            //console.log(outputs)
        });
        console.log(req.files);
        
        await club.create({
            club_name : req.body.club_name,
            club_background : req.files["club_background"][0].location,
            club_logo : req.files["club_logo"][0].location,
            club_explanation : req.body.club_explanation,
            club_manager : userName,
            club_count : 1,
            user_id : decoded.id
        },
        async function(err, outputs){
            if(err){
                res.status(500).send({
                    message : "Internal Server Error"
                })
            }else{
                //console.log(outputs._id);
                clubIdx = outputs._id;
                await position.create({
                    user_id : decoded.id,
                    club_id : clubIdx,
                    position_category : 0
                },async function(err,results){
                    if(err){
                        res.status(500).send({
                            message : "Internal Server Error"
                        });
                    }
                });
                // 계좌 추가
                await account_info.create({
                    club_id : clubIdx,
                    account_bank : req.body.bank_name,
                    account_number : req.body.bank_account,
                    user_id : decoded.id
                },
                async function(err,results){
                    if(err){
                        res.status(500).send({
                            message:"Internal Server Error"
                        });
                    }else{
                        res.status(201).send({
                            message:"success to create club"
                        });
                    }
                });
        }
    });
});
router.get('/detail',async(req,res,next)=>{
    let clubIdx = req.query.club_id;
    let token = req.headers.token;
    
    let decoded = jwt.verify(token);

    let user_position;
    let club_check;
    
    let checkOutput = await position.find(
        {$and:[{user_id :decoded.id},{club_id : clubIdx}]});

    if(checkOutput.length===0){//가입 안한 사람
        club_check = 0;
        user_position = null;
    }else{//가입한 사람
        club_check = 1;
        user_position = checkOutput[0].position_category;

    }


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
        club_logo : cluboutput[0].club_logo,
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

    let noticeTotalData
    if(noticeoutput.length === 0){
        noticeTotalData ={
            notice_title : null,
            notice_content : null,
            notice_category : null,
            notice_id : null
        }

    }else{
        noticeTotalData ={
            notice_title : noticeoutput[0].notice_title,
            notice_content : noticeoutput[0].notice_content,
            notice_category : noticeoutput[0].notice_category,
            notice_id : noticeoutput[0]._id
        }

    }

    let noticeoutput2 = await notice.find({$and:[{club_id : clubIdx},
        {notice_date:{$gte:new Date(moment().format())}}]}).sort({"notice_date":-1});
        let data2;
        let day;
    if(noticeoutput2.length ===0){
        data2 =  {
            notice_title : null,
            notice_date : null,
            notice_time : null,
            notice_day : null
        }

    }else{
        day = new Date(noticeoutput2[0].notice_date)
        data2 =  {
            notice_title : noticeoutput2[0].notice_title,
            notice_date : noticeoutput2[0].notice_date,
            notice_time : noticeoutput2[0].notice_time,
            notice_day : day.getDay()
        }
    }
    let user_data = {
        club_checking : club_check,
        user_position : user_position
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
            totalNotice : noticeTotalData,
            user_data : user_data
        }
    })


});
router.post('/join',async(req,res,next)=>{
    let clubId = req.body.club_id;
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    if(!clubId || !token){
        res.status(400).send({
            message:"Null value"
        });
        
        return false;
    }
    if(decoded === -1){
        res.status(400).send({
            message:"token error"
        })
        
        return false;
    };
    let checkPeople = await position.find({
        club_id : clubId,
        user_id : decoded.id
    })
    if(checkPeople.length > 0){
        res.status(400).send({
            message : "Already Exists"
        })
        return false;

    }

    await position.create({
        club_id : clubId,
        user_id : decoded.id,
        position_category : 1
    },
    function(err,output){
        if(err){
            res.status(500).send({
                message:"Internal Server Error"
            })
            
        return false;
        }
    });// position 컬랙션 가입자 추가

    club.updateOne({_id : clubId},
        {$inc : {club_count:1}},
        function(err,output){
            if(err){
                res.status(500).send({
                    message:"Internal Server Error"
                })
                
        return false;
            }
    });// 카운트 수 +1 업데이트
    res.status(200).send({
        message:"Success to enter club"
    })
});



module.exports = router;
