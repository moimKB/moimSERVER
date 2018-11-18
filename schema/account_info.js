const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let accountInfoSchema = new Schema({
    account_bank : String,
    account_number : String,
    user_id : String,
    club_id : {type: String, default : null}
},{
    versionKey:false
});
module.exports = mongoose.model('accountInfo',accountInfoSchema);