const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');
const upload = require('../../../config/multer').uploadClubImage;
const club = require('../../../schema/club')
const position = require('../../../schema/position');
const crypto = require('crypto-promise');
const user = require('../../../schema/user');


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



module.exports = router;
