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
    user_account : {type : String, default : null},
    user_bank :{type : String, default : null},
    user_deviceToken : {type : String, default : null}
},{
    versionKey:false
});
module.exports = mongoose.model('user',userSchema);