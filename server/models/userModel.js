const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // cardId: {
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Card"
    // },
    language: {
        type: String,
        default: "ENGLISH",
        required: true
    }
}, { timestamps: true })

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;