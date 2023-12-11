const mongoose = require('mongoose');
const validateMongooseid = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error("Id invalid or not found")
    }
}

module.exports = validateMongooseid;