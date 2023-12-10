// Import the Mongoose library for MongoDB connection
const { default: mongoose } = require("mongoose");

// Function to connect to the MongoDB database
const dbConnect = () => {
    try {
        // Attempt to establish a connection to the MongoDB database using the provided URI
        const conn = mongoose.connect(process.env.DATABASE_URI);

        // Log a success message if the connection is established
        console.log('Database connected successfully!');
    } catch (error) {
        // Log an error message if there is an issue connecting to the database
        console.log(`Database Error: ${error}`);
    }
};

// Export the database connection function for use in other parts of the application
module.exports = dbConnect;
