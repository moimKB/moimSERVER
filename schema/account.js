const mongoose = require('mongoose');
const moment = require('moment')
const Schema = mongoose.Schema;

let accountSchema = new Schema({
    write_time : {type : Date, default : new Date(moment().format())},
    price : {type : Number, default : null},//돈
    bank : String,
    account_number : String,
    account_content : {type : String, default : null},
    to_user_id :{type : String, default : null},
    from_user_id : String
},{
    versionKey:false
});
module.exports = mongoose.model('account',accountSchema);