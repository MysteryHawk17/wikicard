const templateDB = require("../models/cardTemplate");
const asynchandler = require('express-async-handler');
const response = require("../middlewares/responseMiddleware");
const { uploadFile, deleteFile } = require("../utils/fileHandler")

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Admin routes established');
})

//create template
const createTemplate = asynchandler(async (req, res) => {
    if (!req.file) {
        return response.validationError(res, 'Cannot create a template without the image');
    }
    try {
        const imageUrl = await uploadFile(req.file.path);
        if (!imageUrl) {
            return response.internalServerError(res, 'failed to create a template');
        }
        const newTemplate = await templateDB.create({
            image: imageUrl
        })
        if (!newTemplate) {
            return response.internalServerError(res, 'Failed to create the template');
        }
        response.successResponse(res, newTemplate, "Created the template successfully")
    } catch (error) {
        response.internalServerError(res, 'Error occurred in creating the template.')
        console.log(error);
    }
})

//get all templates
const getAlltemplates = asynchandler(async (req, res) => {
    try {
        const fetchTemplates = await templateDB.find();
        if (!fetchTemplates) {
            return response.internalServerError(res, 'Cannot fetch the templates');
        }
        response.successResponse(res, fetchTemplates, "fetched the template succcessfully");
    } catch (error) {
        response.internalServerError(res, 'Error occured in finding user');
        console.log(error)
    }
})

//get a template
const gettemplate = asynchandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (id == "id") {
            return response.validationError(res, 'Cannot find the template without its id');
        }
        const fetchTemplate = await templateDB.findById({ _id: id });
        if (!fetchTemplate) {
            return response.internalServerError(res, 'Cannot fetch the templates');
        }
        response.successResponse(res, fetchTemplate, "fetched the template succcessfully");
    } catch (error) {
        response.internalServerError(res, 'Error occured in finding user');
        console.log(error)
    }
})

//delete a template
const deletetemplate = asynchandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (id == "id") {
            return response.validationError(res, 'Cannot find the template without its id');
        }
        const fetchTemplate = await templateDB.findById({ _id: id });
        if (!fetchTemplate) {
            return response.internalServerError(res, 'Cannot fetch the templates');
        }
        const deleteMedia = await deleteFile(fetchTemplate.image);
        if (!deleteMedia) {
            return response.internalServerError(res, "Cannot delete media from cloudinary");
        }
        const deletedTemplate = await templateDB.findByIdAndDelete({ _id: id });
        if (!deletedTemplate) {
            response.internalServerError(res, "Cannot delete template");
        }
        response.successResponse(res, deletedTemplate, "fetched the template succcessfully");
    } catch (error) {
        response.internalServerError(res, 'Error occured in finding user');
        console.log(error)
    }
})


module.exports = { test, createTemplate, getAlltemplates, gettemplate, deletetemplate };