const jwt = require('jsonwebtoken');

//secret key import
const secretKey = require('../config/secretKey').secretAccessKey;

module.exports = {

    sign : function(id) {
        //옵션
        const options = {
            algorithm : "HS256",
            expiresIn : 60 * 60 * 24 * 7 //7 days
        };

        //페이로드
        const payload = {
            _id : id
        };

        //토큰 생성
        let token = jwt.sign(payload, secretKey, options);

        //토큰 반환
        return token;
    },

    verify : function(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        }
        catch(err) {
            if(err.message === 'jwt expired') {
                console.log('expired token');
                return 10;
            }
            else if(err.message === 'invalid token') console.log('invalid token');
        }
        if(!decoded) {
            return -1;
        }else {
            return decoded;
        }
    }
};