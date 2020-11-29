const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {unique: true, required: true, type: String},
    password: {required: true, type: String},
    links: [{type: Types.ObjectId, ref: 'Link'}]
})

module.exports = model('User', schema)