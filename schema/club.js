const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clubSchema = new Schema({
    club_pw : String,
    club_salt : String,
    club_name : String,
    club_open : Number,
    club_background : String,
    club_logo : String,
    club_explanation : String,
    notice : Array,
    user : String
},{
    versionKey:false
});
module.exports = mongoose.model('club',clubSchema);