const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let noticeSchema = new Schema({
    club_id : String,
    write_time : Date,
    notice_title : String,
    notice_category : Number,
    notice_place : String,
    notice_date : Date,
    notice_time : String,
    notice_content : String,
    notice_people : Array
},{
    versionKey:false
});

module.exports = mongoose.model('notice',noticeSchema);