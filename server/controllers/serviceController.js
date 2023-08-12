const cardDB = require('../models/cardModel')
const serviceDB = require("../models/serviceModel");
const asynhandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")
const { uploadFile, deleteFile } = require("../utils/fileHandler")
const test = asynhandler(async (req, res) => {
    response.successResponse(res, '', 'Service Routes established');
})


//create service
const createService = asynhandler(async (req, res) => {
    const { name, url, description, cardId } = req.body;
    try {
        if (!name || !url || !description || !cardId || !req.file) {
            return response.validationError(res, 'Cannot create service without the details')
        }
        const findCard = await cardDB.findById({ _id: cardId });
        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }


        const icon = req.file ? await uploadFile(req.file.path) : "";
        if (!icon) {
            return response.internalServerError(res, 'Cannot create service');
        }
        const newService = await serviceDB.create({
            name: name,
            url: url,
            cardId: cardId,
            description: description,
            icon: icon
        })
        if (!newService) {
            return response.internalServerError(res, 'Error in creating a service');
        }
        findCard.services.push(newService._id);
        await findCard.save();
        // const findAllServices = await serviceDB.find({ cardId: cardId });
        response.successResponse(res, newService, "Created services successfully");
    } catch (error) {
        response.internalServerError(res, 'Failed to create service');
        console.log(error);
    }

})

//get all service
const getAllServices = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ':cardId') {
        return response.validationError(res, 'Cannot find services without the card id');
    }
    try {
        const findAllServices = await serviceDB.find({ cardId: cardId });
        if (!findAllServices) {
            return response.internalServerError(res, 'Cannot fetch services');
        }
        response.successResponse(res, findAllServices, 'Successfully fetched the services');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }

})

//get a service
const getAServices = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find services without the card id');
    }
    try {
        const findService = await serviceDB.findById({ _id: id });
        if (!findService) {
            return response.internalServerError(res, 'Cannot fetch services');
        }
        response.successResponse(res, findService, 'Successfully fetched the services');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }

})


//delete service
const deleteService = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find services without the card id');
    }
    try {
        const findServie = await serviceDB.findById({ _id: id });
        if (!findServie) {
            return response.internalServerError(res, 'Cannot fetch services');
        }
        const deletedServices = await serviceDB.findByIdAndDelete({ _id: id });
        if (!deletedServices) {
            return response.internalServerError(res, 'Failed to delete the service');
        }
        const updateCard = await cardDB.findByIdAndUpdate({ _id: deletedServices.cardId }, {
            $pull: { services: findServie._id }
        }, { new: true });
        response.successResponse(res, deletedServices, 'Deleted services successfully');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }
})

//edit service
const updateSevice = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find services without the card id');
    }
    try {
        const findService = await serviceDB.findById({ _id: id });
        if (!findService) {
            return response.internalServerError(res, 'Cannot fetch services');
        }
        const { name, url, description } = req.body;
        if (name) {
            findService.name = name;
        }
        if (url) {
            findService.url = url;
        }
        if (description) {
            findService.description = description;
        }
        if (req.file) {
            const uploadedFile = await uploadFile(req.file.path);
            if (!uploadedFile) {
                return response.internalServerError(res, 'Failed to update file');
            }
            findService.icon = uploadedFile;
        }
        const savedService = await findService.save();
        if (!savedService) {
            return response.internalServerError(res, 'Failed to update the service');
        }
        response.successResponse(res, savedService, 'Successfully updated the service');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }
})


module.exports = { test, createService, getAllServices, getAServices, deleteService, updateSevice };