const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');
const notice = require('../../../schema/notice')
const club = require('../../../schema/club')



router.get('/',async(req,res)=>{
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let tempArr = new Array;
    let peopleArr = new Array;

    if(decoded=== -1 || decoded === 10){
        res.status(400).send({
            message: "token error"
        })
    }
    let output = await notice.find({notice_category : 1});
    if(!output){
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
    for(let i = 0 ; i<output.length ; i++){

        let Id = output[i].club_id;
        peopleArr = output[i].notice_people;

        for(let a = 0 ; a < peopleArr.length ; a++){
            if(decoded.id === peopleArr[a].user_id){
                console.log(decoded.id)
                console.log(peopleArr[a].user_id)
                console.log(typeof(decoded.id))
                
                let clubOutput = await club.find({_id : Id},{club_logo: true,club_name: true});
                
                if(!clubOutput){
                    res.status(500).send({
                        message: "Internal Server Error"
                    })
                }
                let temp ={
                    club_logo : clubOutput[0].club_logo,
                    club_name : clubOutput[0].club_name,
                    club_manager : output[i].club_manager,
                    write_time : output[i].write_time,
                    notice_title : output[i].notice_title,
                    notice_content : output[i].notice_content,
                    account_check : peopleArr[a].account_check
                }
                tempArr.push(temp);
            }
        }
    }
    res.status(200).send({
        message: "success to show finance list",
        data : tempArr
    });



    
})


module.exports = router;