const mongoose = require("mongoose");


const testimonialSchema = mongoose.Schema({
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    },
    name: {
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


const testimonialModel = mongoose.model("Testimonial", testimonialSchema)

module.exports = testimonialModel;