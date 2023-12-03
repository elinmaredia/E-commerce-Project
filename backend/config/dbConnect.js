const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.DATABASE_URI);
        console.log('Database connected successfully!');
    } catch (error) {
        console.log(`Database Error ${error}`);
    }
    
};

module.exports = dbConnect;