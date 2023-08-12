const mongoose = require("mongoose")


const cardSchema = mongoose.Schema({
    image: {
        type: String
    }
}, { timestamps: true });

const cardTemplate = mongoose.model("Template", cardSchema);
module.exports = cardTemplate;
