const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    user_id : String,
    user_pw : String,
    user_name : String,
    user_salt : String,
    user_phone : String,
    user_sex : Number,
    user_birth : Date,
    user_univ : String,
    user_major : String,
    user_deviceToken : {type : String, default : null},
    user_img : {type : String, default : "https://s3.ap-northeast-2.amazonaws.com/seolwon/KakaoTalk_Photo_2018-11-18-02-52-53.png"}
},{
    versionKey:false
});
module.exports = mongoose.model('user',userSchema);