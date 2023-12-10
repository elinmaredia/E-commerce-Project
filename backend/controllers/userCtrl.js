// Import the required modules for user authentication and security
const User = require('../models/userModel.js');
const asyncHandler = require('express-async-handler');


// Define an asynchronous function to manage user registration
const createUser = asyncHandler(async (req, res) => {
    // Extract the email from the incoming request body
    const email = req.body.email;

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
        // If the user doesn't exist, create a new user account
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // If the user already exists, raise an error
        throw new Error('User Already Exists');
    }
});

// Import the required modules for user authentication and token generation
const loginUserCtrl = asyncHandler(async (req, res) => {
    // Extract email and password from the incoming request body
    const { email, password } = req.body;
  
    // Check if a user with the provided email exists
    const existingUser = await User.findOne({ email });
  
    // Verify the user's credentials
    if (existingUser && (await existingUser.isPasswordMatched(password))) {
      
      res.json(existingUser);

    } else {
      // If the credentials are invalid, raise an error
      throw new Error("Invalid Credentials");
    }
  });
  



// Export the createUser function for use in other modules
module.exports = { createUser, loginUserCtrl };
