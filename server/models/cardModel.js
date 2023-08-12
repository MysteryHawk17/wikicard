const mongoose = require("mongoose")

const cardSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    urlAlias: {
        type: String
    },
    cardName: {
        type: String,
        required: true
    },
    desciption: {
        type: String
    },
    designation: {
        type: String
    },
    profilePic: {
        type: String
    },
    coverPic: {
        type: String
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    alternativeMail: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    altPhoneNumber: {
        type: String
    },
    location: {
        type: String
    },
    locationUrl: {
        type: String
    },
    dob: {
        type: String
    },
    company: {
        type: String
    },
    jobTitle: {
        type: String
    },
    defaultLanguage: {
        type: String
    },
    cardTemplates: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template"
    },
    businessHours: [{
        day: {
            type: String
        },
        time: {
            start: {
                type: String
            },
            end: {
                type: String
            }
        }
    }],
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    testimonials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Testimonial"
    }],
    appointments: [{
        day: {
            type: String
        },
        time: [{
            start: {
                type: String
            },
            end: {
                type: String
            }
        }]
    }],
    socialLinks: [{
        name: {
            type: String
        },
        link: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    isCardActive: {
        type: Boolean,
        default: true
    }
})

const cardModel=mongoose.model("Card",cardSchema);
module.exports=cardModel;