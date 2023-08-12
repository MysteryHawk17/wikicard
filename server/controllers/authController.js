const userDB = require("../models/userModel");
const response = require("../middlewares/responseMiddleware")
const asynchandler = require("express-async-handler")
// const bcrypt=require("bcryptjs")
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt")
const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Auth routes established');
})

//create user
const register = asynchandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return response.validationError(res, "Please input all the fields to create a user")
    }
    const findUser = await userDB.findOne({ email: email });
    if (findUser) {
        return response.errorResponse(res, 'User already exists with this mail id', 400);
    }
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const newUser = await userDB({
        fullName: fullName,
        email: email,
        password: hashedPassword
    })
    try {
        const savedUser = await newUser.save();
        if (!savedUser) {
            return response.internalServerError(res, 'Cannot save the user');
        }
        const finalRes = {
            user: savedUser,
            token: jwt(savedUser._id)
        }
        response.successResponse(res, finalRes, 'Saved the user successfully');

    } catch (error) {
        response.internalServerError(res, "Error in creating user");
        console.log(error.response)
    }

})

//login user
const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    try {


        if (!email || !password) {
            return response.validationError(res, 'Cannot login without proper details');
        }
        const findUser = await userDB.findOne({ email: email });
        if (!findUser) {
            return response.notFoundError(res, 'Cannot find the user');
        }
        const comparePassword = await bcrypt.compare(password, findUser.password);
        if (!comparePassword) {
            return response.errorResponse(res, "Incorrect password", 401);
        }
        const finalRes = {
            user: findUser,
            token: jwt(findUser._id)
        }
        response.successResponse(res, finalRes, 'Login successful');
    } catch (error) {
        response.internalServerError(res, 'Error occured while login');
        console.log(error);
    }
})


//forgot password



//reset password


//change password

const changePassword = asynchandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    const userId = req.user._id;
    try {


        if (!newPassword || !oldPassword) {
            return response.validationError(res, 'Cannot change password without the proeper details');
        }
        const findUser = await userDB.findById({ _id: userId });
        if (!findUser) {
            return response.notFoundError(res, "cannot find the user");
        }
        const comparePassword = await bcrypt.compare(oldPassword, findUser.password);
        if (!comparePassword) {
            return response.errorResponse(res, 'Incorrect old password', 401);
        }
        const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        findUser.password = hashedPassword;
        await findUser.save();
        response.successResponse(res, findUser, 'Updated the password successfully')
    } catch (error) {
        response.internalServerError(res, "Error occured in changing password")
        console.log(error);
    }
})




module.exports = { test, register, loginUser, changePassword };