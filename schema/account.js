const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let accountSchema = new Schema({
    write_time : Date,
    deposit : Number,//입금
    withdraw : Number,//출금
    account_content : String,
    user_id :String
},{
    versionKey:false
});
module.exports = mongoose.model('account',accountSchema);