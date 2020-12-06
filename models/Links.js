const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    from: {required: true, type: String},
    to: {unique: true, required: true, type: String},
    counter: {type: Number},
    owner: {type: Types.ObjectId, ref: "User"}
})

module.exports = model('Links', schema)