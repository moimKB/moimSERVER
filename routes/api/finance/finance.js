const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');
const account_info = require('../../../schema/account_info')
const account = require('../../../schema/account')
const club = require('../../../schema/club')
const user = require('../../../schema/user')


router.get('/info',async(req,res,next)=>{
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let club_id = req.query.club_id;
    let filterId;
    if(!token){
        res.status(400).send({
            messsage : "Internal Server Error"
        });
    }
    if(decoded === -1 || decoded === 10 ){
        res.status(400).send({
            messsage : "token error"
        });
    }
    //let clubManager = await club.find({});
    let output = await account_info.find({club_id :club_id});
    if(!output){
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
    filterId = output[0].user_id;


    let depositResult = await account.aggregate([{'$match':{from_user_id : filterId}},{$group : {_id :club_id, totalDeposit:{$sum : "$price"}}}
    ]);// 받은 돈

    let withdrawResult = await account.aggregate([{'$match':{to_user_id : filterId}},{$group : {_id :club_id, totalWithdraw:{$sum : "$price"}}}
    ]);// 주는 돈
    if(!depositResult || !withdrawResult){
        res.status(500).send({
            message : "Internal Server Error"
        });
    }
    let tempDeposit;
    let tempWithdraw;
    let totalPrice;
    if(depositResult.length <=0){
        tempDeposit = 0;

    }else{
        tempDeposit = depositResult[0].totalDeposit;
    }

    if(withdrawResult.length <=0) {
        tempWithdraw = 0;

    }else{
        tempWithdraw = withdrawResult[0].totalWithdraw;
    }
    
    totalPrice = tempDeposit - tempWithdraw;
    
    
    let data  = {
        account_bank : output[0].account_bank,
        account_number: output[0].account_number,
        price : totalPrice
    }
    res.status(200).send({
        message : "Success to show accountInfo",
        data : data
    });
});

router.get('/',async(req,res,next)=>{
    let token = req.headers.token;
    let club_id = req.query.club_id;
    let year = req.query.search_year;
    let month = req.query.search_month;
    let decode = jwt.verify(token);
    let checking;
    year = parseInt(year)
    month = parseInt(month)
    if(!token || ! club_id || !year || !month){
        res.status(400).send({
            message:"Null Value"
        })
    }

    if(decode === -1 || decode === 10){
        res.status(400).send({
            message : "token error"
        })
    }
    console.log(decode.id);

    //{$and : [{club_id : club_id},{$or:[{from_user_id : decode.id},{to_user_id:decode.id}]}]}
    let arr = new Array;
    let output = await account.find({$and : [{club_id : club_id},{$or:[{from_user_id : decode.id},{to_user_id:decode.id}]}]}).sort({"write_time":-1});
    
    console.log(output)
    let image_uri;
    for(let i = 0 ; i< output.length; i++){
        let temp = output[i].write_time;
        if(temp.getMonth()+1 === month && temp.getFullYear()===year){
            if(output[i].from_user_id === decode.id){//입금
                checking = 1;
                let result = await user.find({_id : output[i].from_user_id },{user_img : true});
                image_uri = result[0].user_img;
            }else{
                checking = 0;
                let result = await user.find({_id : output[i].to_user_id },{user_img : true});
                image_uri = result[0].user_img;
            }
            let test = {
                write_time : temp,
                price : output[i].price,
                account_content : output[i].account_content,
                checking : checking,
                image_uri : image_uri
            }
            arr.push(test);
        }
        
    }
    res.status(200).send({
        message: "success to show account list",
        data : arr
    })


});



module.exports = router;