const cardDB = require('../models/cardModel')
const templateDB = require("../models/cardTemplate");
const asynhandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")
const { uploadFile, deleteFile } = require("../utils/fileHandler")


const test = asynhandler(async (req, res) => {
    response.successResponse(res, '', 'Card Routes established');
})


//create card

const createCard = asynhandler(async (req, res) => {
    const { urlAlias, cardName, designation, description } = req.body;
    if (!urlAlias || !cardName) {
        return response.validationError(res, 'Cannot create card without proper information');
    }
    try {
        var profilePic = ''
        var coverPic = ''
        const userId = req.user._id;
        if (req.files.profile) {
            console.log(req.files.profile[0])
            profilePic = await uploadFile(req.files.profile[0].path)
            if (!profilePic) {
                return response.internalServerError(res, 'Cannot upload profile pic')
            }
        }
        if (req.files.cover) {
            coverPic = await uploadFile(req.files.cover[0].path)
            if (!coverPic) {
                return response.internalServerError(res, 'Cannot upload Cover pic')
            }
        }
        const findTemplate = await templateDB.find();
        if (findTemplate.length == 0 || !findTemplate) {
            return response.internalServerError(res, "Failed to create user card");
        }
        const newCard = new cardDB({
            userId: userId,
            urlAlias: urlAlias,
            cardName: cardName,
            designation: designation,
            description: description,
            coverPic: coverPic,
            profilePic: profilePic,
            fullName: req.user.fullName,
            email: req.user.email,
            cardTemplates: findTemplate[0]._id
        })

        const savedCard = await newCard.save();
        if (!savedCard) {
            return response.internalServerError(res, "Failed to save the card");
        }
        const findCard = await cardDB.findById({ _id: savedCard._id }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");
        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        response.successResponse(res, findCard, 'Card created successfully');
    } catch (error) {
        response.internalServerError(res, 'Error occured.')
        console.log(error)
    }

})

//get all cards for a user

const getAllUserCards = asynhandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        return response.validationError(res, "Cannot fetch the cards without the user id");
    }
    try {
        const findAllcards = await cardDB.find({ userId: userId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");
        if (!findAllcards) {
            return response.internalServerError(res, 'Cannot fetch the cards');
        }

        response.successResponse(res, findAllcards, "fetched the cards successfully");
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})

//get a card
const getCard = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ":cardId") {
        return response.validationError(res, 'Card cannot be edited without the card id');
    }
    try {
        const findCard = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");
        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        response.successResponse(res, findCard, "Card fetched successfully");
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})

//update basic details
const updateBasicDetails = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ":cardId") {
        return response.validationError(res, 'Card cannot be edited without the card id');
    }
    try {
        const findCard = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");

        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        if (findCard.userId._id.toString !== req.user._id.toString) {
            return response.errorResponse(res, 'Unauthorized to edits', 400);
        }
        const { cardName, description, designation, fullName, email, alternativeMail, phoneNumber, altPhoneNumber, location, locationUrl, dob, company, jobTitle, defaultLanguage } = req.body;

        if (cardName) {
            findCard.cardName = cardName;
        }
        if (description) {
            findCard.description = description;
        }
        if (designation) {
            findCard.designation = designation;
        }
        if (fullName) {
            findCard.fullName = fullName;
        }
        if (email) {
            findCard.email = email;
        }
        if (alternativeMail) {
            findCard.alternativeMail = alternativeMail;
        }
        if (phoneNumber) {
            findCard.phoneNumber = phoneNumber;
        }
        if (altPhoneNumber) {
            findCard.altPhoneNumber = altPhoneNumber;
        }
        if (location) {
            findCard.location = location;
        }
        if (locationUrl) {
            findCard.locationUrl = locationUrl;
        }
        if (dob) {
            findCard.dob = dob;
        }
        if (company) {
            findCard.company = company;
        }
        if (jobTitle) {
            findCard.jobTitle = jobTitle;
        }
        if (defaultLanguage) {
            findCard.defaultLanguage = defaultLanguage;
        }
        if (req.files.profile) {
            console.log(req.files.profile[0])
            const profilePic = await uploadFile(req.files.profile[0].path)
            if (!profilePic) {
                return response.internalServerError(res, 'Cannot upload profile pic')
            }
            findCard.profilePic = profilePic;
        }
        if (req.files.cover) {
            const coverPic = await uploadFile(req.files.cover[0].path)
            if (!coverPic) {
                return response.internalServerError(res, 'Cannot upload Cover pic')
            }
            findCard.coverPic = coverPic;
        }
        const savedCard = await findCard.save();
        if (!savedCard) {
            return response.internalServerError(res, 'Failed to update cardd');
        }
        response.successResponse(res, savedCard, 'Updated the card successfully');
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})


//update template
const updateTemplate = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ":cardId") {
        return response.validationError(res, 'Card cannot be edited without the card id');
    }
    try {
        const findCard = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");

        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        if (findCard.userId._id.toString !== req.user._id.toString) {
            return response.errorResponse(res, 'Unauthorized to edits', 400);
        }
        const { templateId } = req.body;
        if (!templateId) {
            return response.errorResponse(res, 'Template id required', 400);
        }
        findCard.templateId = templateId;
        await findCard.save();
        const findCard1 = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");
        if (!findCard1) {
            return response.internalServerError(res, 'Failed to update template');
        }
        response.successResponse(res, findCard1, 'Updated template successfully');
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})

//update business hours
const updateBusinessHours = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ":cardId") {
        return response.validationError(res, 'Card cannot be edited without the card id');
    }
    try {
        const findCard = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");

        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        if (findCard.userId._id.toString !== req.user._id.toString) {
            return response.errorResponse(res, 'Unauthorized to edits', 400);
        }
        const { businessHours } = req.body;
        if (!businessHours) {
            return response.errorResponse(res, 'Business hours required', 400);
        }
        findCard.businessHours = businessHours;
        const savedCard = await findCard.save();

        if (!savedCard) {
            return response.internalServerError(res, 'Failed to update template');
        }
        response.successResponse(res, savedCard, 'Updated business hours successfully');
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})

//update appointments

const updateAppointments = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ":cardId") {
        return response.validationError(res, 'Card cannot be edited without the card id');
    }
    try {
        const findCard = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");

        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        if (findCard.userId._id.toString !== req.user._id.toString) {
            return response.errorResponse(res, 'Unauthorized to edits', 400);
        }
        const { appointments } = req.body;
        if (!appointments) {
            return response.errorResponse(res, 'Business hours required', 400);
        }
        findCard.appointments = appointments;
        const savedCard = await findCard.save();

        if (!savedCard) {
            return response.internalServerError(res, 'Failed to update template');
        }
        response.successResponse(res, savedCard, 'Updated appointments successfully');
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})

//update social links
const updateSocialLinks = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ":cardId") {
        return response.validationError(res, 'Card cannot be edited without the card id');
    }
    try {
        const findCard = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");

        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        if (findCard.userId._id.toString !== req.user._id.toString) {
            return response.errorResponse(res, 'Unauthorized to edits', 400);
        }
        const { socialLinks } = req.body;
        if (!socialLinks) {
            return response.errorResponse(res, 'Social Links', 400);
        }
        findCard.socialLinks = socialLinks;
        const savedCard = await findCard.save();

        if (!savedCard) {
            return response.internalServerError(res, 'Failed to update template');
        }
        response.successResponse(res, savedCard, 'Updated social links successfully');
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})

//update the card active status
const updateCardStatus = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ":cardId") {
        return response.validationError(res, 'Card cannot be edited without the card id');
    }
    try {
        const findCard = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");

        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        if (findCard.userId._id.toString !== req.user._id.toString) {
            return response.errorResponse(res, 'Unauthorized to edits', 400);
        }
        const { status } = req.body;
        if (status == undefined || status == null) {
            return response.errorResponse(res, 'Status required', 400);
        }
        findCard.isCardActive = !findCard.isCardActive;
        const savedCard = await findCard.save();

        if (!savedCard) {
            return response.internalServerError(res, 'Failed to update template');
        }
        response.successResponse(res, savedCard, 'Updated status successfully');
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})

const deleteCard = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ":cardId") {
        return response.validationError(res, 'Card cannot be edited without the card id');
    }
    try {
        const findCard = await cardDB.findById({ _id: cardId }).populate("userId").populate("services").populate("products").populate("testimonials").populate("cardTemplates");
        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }
        if (findCard.userId._id.toString !== req.user._id.toString) {
            return response.errorResponse(res, 'Unauthorized to delete', 400);
        }
        const deletedCard = await cardDB.findByIdAndDelete({ _id: cardId });
        if (!deletedCard) {
            return response.internalServerError(res, 'Cannot delete card');
        }
        response.successResponse(res, findCard, "Card deleted successfully");
    } catch (error) {
        response.internalServerError(res, "Error occured");
        console.log(error);
    }
})

module.exports = { test, createCard, getAllUserCards, getCard, updateBasicDetails, updateTemplate, updateAppointments, updateCardStatus, updateBusinessHours, updateSocialLinks ,deleteCard};