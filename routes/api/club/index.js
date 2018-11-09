const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');
const upload = require('../../../config/multer').uploadClubImage;
const club = require('../../../schema/club')
const position = require('../../../schema/position');
const crypto = require('crypto-promise');

/* GET home page. */
router.get('/', async (req, res, next) => {

});

router.post('/', upload.fields([{name : 'club_logo', maxCount : 1}, {name : 'club_background', maxCount : 1}]),
    async (req,res,next)=>{
        
        let token = req.headers.token;
        let decoded = jwt.verify(token);
        let clubIdx;
        let pw = req.body.club_pw;
        let salt = await crypto.randomBytes(32);
        let hashPw = await crypto.pbkdf2(pw, salt.toString('base64'), 100000, 32, 'sha512');


        await club.create({
            club_pw : hashPw.toString('base64'),
            club_salt : salt.toString('base64'),
            club_name : req.body.club_name,
            club_open : req.body.club_open,
            club_background : req.files["club_background"][0].location,
            club_logo : req.files["club_logo"][0].location,
            club_explanation : req.body.club_explanation
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
