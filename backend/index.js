// Import the Express framework for building the web application
const express = require('express');

// Import the function for connecting to the database
const dbConnect = require('./config/dbConnect.js');

// Create an instance of the Express application
const app = express();

// Load environment variables from the .env file
const dotenv = require('dotenv').config();

// Define the port on which the server will listen
const PORT = process.env.PORT || 4000;

// Import the authentication routes
const authRouter = require('./routes/authRoutes.js');

// Import middleware for parsing request bodies
const bodyParser = require('body-parser');

// Import custom error handling middleware
const { notFound, errorHandler } = require('./middleware/errorHandler.js');

// Establish a connection to the database
dbConnect();

// Configure middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define a default route to handle incoming requests
app.get('/', (req, res) => {
    res.send("Hello from server side");
});

// Use the authentication routes for requests starting with /api/user
app.use('/api/user', authRouter);

// Use custom error handling middleware for 404 Not Found
app.use(notFound);

// Use custom error handling middleware for general errors
app.use(errorHandler);

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
