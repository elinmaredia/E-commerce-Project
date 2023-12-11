// Import the required modules for user authentication and security
const User = require('../models/userModel.js');
const asyncHandler = require('express-async-handler');
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require('../utils/validateMongodb.js')
const { generateRefreshToken } = require('../config/generateRefreshToken.js')
const jwt = require("jsonwebtoken")

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
      const refreshToken = await generateRefreshToken(existingUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        existingUser._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
        res.json({
            _id: existingUser?._id,
            firstname: existingUser?.firstname,
            lastname: existingUser?.lastname,
            email: existingUser?.email,
            mobile: existingUser?.mobile,
            token: generateToken(existingUser?._id),
          });

    } else {
      // If the credentials are invalid, raise an error
      throw new Error("Invalid Credentials");
    }
  });

  //Handling refresh token
  const handleRefreshToken = asyncHandler(async (req, res) => {
    try {
        const cookie = req.cookies;
        if (!cookie?.refreshToken) {
            throw new Error("No Refresh Token found in Cookies");
        }

        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({ refreshToken });

        if (!user) {
            throw new Error("Refresh Token not found in the database or doesn't match");
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err || user.id !== decoded.id) {
                throw new Error("An issue with the Refresh Token has occurred");
            }

            const accessToken = generateToken(user?._id);
            res.json({ accessToken });
        });
    } catch (error) {
        throw new Error(error.message);
    }
});



const logout = asyncHandler(async (req, res) => {
  try {
      const cookie = req.cookies;
      if (!cookie?.refreshToken) {
          throw new Error("No Refresh Token found in Cookies");
      }

      const refreshToken = cookie.refreshToken;
      const user = await User.findOne({ refreshToken });

      if (!user) {
          res.clearCookie("refreshToken", {
              httpOnly: true,
              secure: true,
          });
          return res.sendStatus(204); // Forbidden
      }

      await User.findOneAndUpdate({ refreshToken: refreshToken }, {
          refreshToken: "",
      });

      res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
      });

      res.sendStatus(204); // Forbidden
  } catch (error) {
      throw new Error(error.message);
  }
});

  
  // Retrieve all users with their wishlists
const getAllUsers = asyncHandler(async (req, res) => {
    try {
      const allUsers = await User.find();
      res.json(allUsers)
      
    } catch (error) {
      throw new Error(error);
    }
  });
  
  // Retrieve a single user by ID
  const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    validateMongoDbId(id);
    res.json({
        user,
    })
  
    try {
      const singleUser = await User.findById(id);
      res.json({
        user: singleUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  // Delete a single user by ID
  const deleteSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      res.json({
        deletedUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

  //Update user's info
  const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          firstname: req?.body?.firstname,
          lastname: req?.body?.lastname,
          email: req?.body?.email,
          mobile: req?.body?.mobile,
        },
        {
          new: true,
        }
      );
      res.json(updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const blockUser = asyncHandler(async (req, res) => {
      const {id} = req.params;
      validateMongoDbId(id);
      try {
        const block = await User.findByIdAndUpdate(
          id,
          {
            isBlocked: true,
          },
          {
            new: true,
          }
        )
        res.json({
          message: "User Blocked"
        })
      } catch (error) {
        throw new Error(error)
      }
  })

  const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
      try {
        const unblock = await User.findByIdAndUpdate(
          id,
          {
            isBlocked: false,
          },
          {
            new: true,
          }
        )
        res.json({
          message: "User Unblocked"
        })
      } catch (error) {
        throw new Error(error)
      }
  })


// Export the createUser function for use in other modules
module.exports = { 
  createUser, 
  loginUserCtrl, 
  getAllUsers, 
  getSingleUser, 
  deleteSingleUser, 
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout, 
};
