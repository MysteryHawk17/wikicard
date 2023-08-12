const cardDB = require('../models/cardModel')
const asynhandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")
const testimonialDB = require("../models/testimonialMode");
const { uploadFile, deleteFile } = require("../utils/fileHandler")


const test = asynhandler(async (req, res) => {
    response.successResponse(res, '', 'Testimonial Routes established');
})


//create testimonial
const createTestimonial = asynhandler(async (req, res) => {
    const { name, description, cardId } = req.body;
    try {
        if (!name || !description || !cardId || !req.file) {
            return response.validationError(res, 'Cannot create Testimonial without the details')
        }
        const findCard = await cardDB.findById({ _id: cardId });
        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }


        const icon = req.file ? await uploadFile(req.file.path) : "";
        if (!icon) {
            return response.internalServerError(res, 'Cannot create testimonial');
        }
        const newTestimonial = await testimonialDB.create({
            name: name,
            cardId: cardId,
            description: description,
            icon: icon
        })
        if (!newTestimonial) {
            return response.internalServerError(res, 'Error in creating a testimonial');
        }
        findCard.testimonials.push(newTestimonial._id);
        await findCard.save();
        // const findAllTestimonials = await testimonialDB.find({ cardId: cardId });
        response.successResponse(res, newTestimonial, "Created Testimonials successfully");
    } catch (error) {
        response.internalServerError(res, 'Failed to create testimonial');
        console.log(error);
    }

})

//get all testimonial

const getAllTestimonials = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ':cardId') {
        return response.validationError(res, 'Cannot find Testimonials without the card id');
    }
    try {
        const findAllTestimonials = await testimonialDB.find({ cardId: cardId });
        if (!findAllTestimonials) {
            return response.internalServerError(res, 'Cannot fetch Testimonials');
        }
        response.successResponse(res, findAllTestimonials, 'Successfully fetched the Testimonials');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }

})

//get a testimonial
const getATestimonial = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find testimonial without the card id');
    }
    try {
        const findTestimonial = await testimonialDB.findById({ _id: id });
        if (!findTestimonial) {
            return response.internalServerError(res, 'Cannot fetch testimonial');
        }
        response.successResponse(res, findTestimonial, 'Successfully fetched the testimonial');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }

})


//delete testimonial
const deleteTestimonial = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find testimonials without the card id');
    }
    try {
        const findTestimonial = await testimonialDB.findById({ _id: id });
        if (!findTestimonial) {
            return response.internalServerError(res, 'Cannot fetch testimonials');
        }
        const deletedTestimonial = await testimonialDB.findByIdAndDelete({ _id: id });
        if (!deletedTestimonial) {
            return response.internalServerError(res, 'Failed to delete the service');
        }
        const updateCard = await cardDB.findByIdAndUpdate({ _id: deletedTestimonial.cardId }, {
            $pull: { testimonials: findTestimonial._id }
        }, { new: true });
        response.successResponse(res, deletedTestimonial, 'Deleted testimonials successfully');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }
})

//edit testimonial
const updateTestimonial = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find testimonials without the card id');
    }
    try {
        const findTestimonial = await testimonialDB.findById({ _id: id });
        if (!findTestimonial) {
            return response.internalServerError(res, 'Cannot fetch testimonials');
        }
        const { name, description } = req.body;
        if (name) {
            findTestimonial.name = name;
        }
        if (description) {
            findTestimonial.description = description;
        }
        if (req.file) {
            const uploadedFile = await uploadFile(req.file.path);
            if (!uploadedFile) {
                return response.internalServerError(res, 'Failed to update file');
            }
            findTestimonial.icon = uploadedFile;
        }
        const savedTestimonial = await findTestimonial.save();
        if (!savedTestimonial) {
            return response.internalServerError(res, 'Failed to update the testimonial');
        }
        response.successResponse(res, savedTestimonial, 'Successfully updated the testimonial');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }
})



module.exports = { test, createTestimonial, getAllTestimonials, getATestimonial, deleteTestimonial, updateTestimonial }