const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clubSchema = new Schema({
    club_pw : {type : String, default : null},
    club_salt : {type : String, default : null},
    club_name : String,
    club_open : Number,
    club_background : String,
    club_logo : String,
    club_explanation : String,
    club_manager : String,
    club_count : Number
},{
    versionKey:false
});
module.exports = mongoose.model('club',clubSchema);