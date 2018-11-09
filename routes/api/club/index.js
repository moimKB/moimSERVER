const express = require('express');
const router = express.Router();
const jwt = require('../../../module/jwt');
const upload = require('../../../config/multer').uploadClubImage;
const club = require('../../../schema/club')
const crypto = require('crypto-promise');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

router.post('/', upload.fields([{name : 'club_logo', maxCount : 1}, {name : 'club_background', maxCount : 1}]),
    async (req,res,next)=>{
        
        let token = req.headers.token;
        let decoded = jwt.verify(token);
        
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
            club_explanation : req.body.club_explanation,
            user: decoded.id
        },
        async function(err, outputs){
            if(err){
                res.status(500).send({
                    message : "Internal Server Error"
                })
            }else{
                res.status(201).send({
                    message : "Success to create club"
                })
            }
        });


});



module.exports = router;
