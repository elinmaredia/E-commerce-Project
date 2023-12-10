// Middleware to handle 404 Not Found errors
const notFound = (req, res, next) => {
  // Create an error object with a message indicating the requested URL was not found
  const error = new Error(`Not Found: ${req.originalUrl}`);
  
  // Set the HTTP status code to 404
  res.status(404);

  // Pass the error to the next middleware in the stack
  next(error);
};

// Middleware to handle general errors
const errorHandler = (err, req, res, next) => {
  // Determine the appropriate status code based on the existing response status code
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;

  // Set the HTTP status code
  res.status(statusCode);

  // Send a JSON response with information about the error
  res.json({
      status: "fail",
      message: err?.message, // Display the error message
      stack: err?.stack, // Display the error stack trace
  });
};

// Export the middleware functions for use in other parts of the application
module.exports = { errorHandler, notFound };
