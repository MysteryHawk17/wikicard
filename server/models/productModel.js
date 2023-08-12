const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    cardId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Card"
    },
    name: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    price: {
        type: Number,
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


const productModel = mongoose.model("Product", productSchema)

module.exports = productModel;