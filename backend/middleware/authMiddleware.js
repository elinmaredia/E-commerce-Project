const User = require("../models/userModel.js");
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error("Not authorized. Session expired. Please login again")
        }
    } else {
        throw new Error("No Token")
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if (adminUser.role !== "admin"){
        throw new Error('Please login with admin credentials')
    } else {
        next();
    }
})

module.exports = {authMiddleware, isAdmin};