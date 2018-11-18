const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 모먼트 설정
const moment = require('moment');

let noticeSchema = new Schema({
    club_id : String,
    write_time : Date,
    club_manager : String,
    notice_title : String,
    notice_cost : {type : Number, default : 0 },
    notice_category : Number,
    notice_place : String,
    notice_date : Date,
    notice_time : String,
    notice_content : String,
    notice_people :  {type : Array, default : null}
},{
    versionKey:false
});

module.exports = mongoose.model('notice',noticeSchema);