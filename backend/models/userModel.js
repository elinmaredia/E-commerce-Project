// Import the Mongoose library for MongoDB schema and model creation
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

// Declare the schema for the MongoDB model representing user information
var userSchema = new mongoose.Schema({
    
    firstname: {
        type: String,
        required: true,
        index: true,
    },
    
    lastname: {
        type: String,
        required: true,
        index: true,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
    },
   
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{type: mongoose.Schema.ObjectId, ref: "Address" }],
    wishlist: [{type: mongoose.Schema.ObjectId, ref: "Product"}]
},
    {
        timestamps: true
    }
);

// Define a pre-save middleware for the user schema
userSchema.pre("save", async function (next) {
    // Check if the password field is modified before hashing
    if (!this.isModified("password")) {
      next();
    }
  
    // Generate a cryptographic salt and hash the password using bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  // Define a method to compare the entered password with the stored hashed password
  userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };



// Export the Mongoose model based on the defined schema, named 'User'
module.exports = mongoose.model('User', userSchema);
