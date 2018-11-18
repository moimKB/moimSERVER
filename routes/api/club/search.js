const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');
const club = require('../../../schema/club');

router.get('/',async(req,res,next)=>{
    let word = req.query.word;
    let output = await club.find({});
    let data = new Array;

    if(!output){
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
    console.log(output);
    output = output.filter((value)=>{
        if(word === ""){
            return true;
        }else{
            if(value["club_name"].indexOf(word)!==-1){
                return true;
            }
        }
    });
    console.log(output)
    for(let i = 0; i<output.length;i++){
        let temp={
            club_id : output[i]._id,
            club_name : output[i].club_name,
            club_explanation : output[i].club_explanation,
            club_logo : output[i].club_logo,
            club_manager : output[i].club_manager,
            club_count : output[i].club_count
        }
        data.push(temp);
    }


    res.status(200).send({
        message : "Success to Search clubname",
        data : data
    })
    

    console.log(output)

})




module.exports = router;