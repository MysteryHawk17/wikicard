const mongoose = require("mongoose");


const serviceSchema = mongoose.Schema({
    cardId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Card"
    },
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
}, { timestamps: true });


const serviceModel = mongoose.model("Service", serviceSchema)

module.exports = serviceModel;