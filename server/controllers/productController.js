const cardDB = require('../models/cardModel')
const productDB = require("../models/productModel");
const asynhandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")
const { uploadFile, deleteFile } = require("../utils/fileHandler")
const test = asynhandler(async (req, res) => {
    response.successResponse(res, '', 'Product Routes established');
})


//create product
const createProduct = asynhandler(async (req, res) => {
    const { name, url, currency, price, description, cardId } = req.body;
    try {
        if (!name || !url || !description || !cardId || !currency || price == undefined || price == null || !req.file) {
            return response.validationError(res, 'Cannot create product without the details')
        }
        const findCard = await cardDB.findById({ _id: cardId });
        if (!findCard) {
            return response.notFoundError(res, "Cannot find the card");
        }


        const icon = req.file ? await uploadFile(req.file.path) : "";
        if (!icon) {
            return response.internalServerError(res, 'Cannot create service');
        }
        const newProduct = await productDB.create({
            name: name,
            url: url,
            cardId: cardId,
            description: description,
            icon: icon,
            currency: currency,
            price: price
        })
        if (!newProduct) {
            return response.internalServerError(res, 'Error in creating a product');
        }
        findCard.products.push(newProduct._id);
        await findCard.save();
        // const findAllProducts = await productDB.find({ cardId: cardId });
        response.successResponse(res, newProduct, "Created product successfully");
    } catch (error) {
        response.internalServerError(res, 'Failed to create product');
        console.log(error);
    }

})


//get all product

const getAllProducts = asynhandler(async (req, res) => {
    const { cardId } = req.params;
    if (cardId == ':cardId') {
        return response.validationError(res, 'Cannot find products without the card id');
    }
    try {
        const findAllProducts = await productDB.find({ cardId: cardId });
        if (!findAllProducts) {
            return response.internalServerError(res, 'Cannot fetch products');
        }
        response.successResponse(res, findAllProducts, 'Successfully fetched the products');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }

})

//get a product

const getAProduct = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find products without the card id');
    }
    try {
        const findProduct = await productDB.findById({ _id: id });
        if (!findProduct) {
            return response.internalServerError(res, 'Cannot fetch products');
        }
        response.successResponse(res, findProduct, 'Successfully fetched the products');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }

})



//delete product

const deleteProduct = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find products without the card id');
    }
    try {
        const findProduct = await productDB.findById({ _id: id });
        if (!findProduct) {
            return response.internalServerError(res, 'Cannot fetch products');
        }
        const deletedProduct = await productDB.findByIdAndDelete({ _id: id });
        if (!deletedProduct) {
            return response.internalServerError(res, 'Failed to delete the service');
        }
        const updateCard = await cardDB.findByIdAndUpdate({ _id: deletedProduct.cardId }, {
            $pull: { products: findProduct._id }
        }, { new: true });
        response.successResponse(res, deletedProduct, 'Deleted products successfully');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }
})




//edit product

const updateProduct = asynhandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        return response.validationError(res, 'Cannot find Product without the card id');
    }
    try {
        const findProduct = await productDB.findById({ _id: id });
        if (!findProduct) {
            return response.internalServerError(res, 'Cannot fetch Product');
        }
        const { name, url, description, currency, price } = req.body;
        if (name) {
            findProduct.name = name;
        }
        if (url) {
            findProduct.url = url;
        }
        if (description) {
            findProduct.description = description;
        }
        if (currency) {
            findProduct.currency = currency;
        }
        if (price) {
            findProduct.price = price;
        }
        if (req.file) {
            const uploadedFile = await uploadFile(req.file.path);
            if (!uploadedFile) {
                return response.internalServerError(res, 'Failed to update file');
            }
            findProduct.icon = uploadedFile;
        }
        const savedProduct = await findProduct.save();
        if (!savedProduct) {
            return response.internalServerError(res, 'Failed to update the product');
        }
        response.successResponse(res, savedProduct, 'Successfully updated the product');
    } catch (error) {
        response.internalServerError(res, 'Error occured');
        console.log(error)
    }
})


module.exports = { test ,createProduct,getAllProducts,getAProduct,updateProduct,deleteProduct}