const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clubSchema = new Schema({
    club_name : String,
    club_background : String,
    club_logo : String,
    club_explanation : String,
    club_manager : String,
    club_count : Number,
    user_id : String
},{
    versionKey:false
});
module.exports = mongoose.model('club',clubSchema);