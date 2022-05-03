const {Schema, model} = require('mongoose')

const listsSchema = new Schema({
    _id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    },
    author: {
        ref: 'users',
        type: Schema.Types.String
    }
})

module.exports = model('lists', listsSchema)