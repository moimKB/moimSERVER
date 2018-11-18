const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let positionSchema = new Schema({
    user_id : String,
    club_id : String,
    position_category : Number
},{
    versionKey:false
});

module.exports = mongoose.model('position',positionSchema);