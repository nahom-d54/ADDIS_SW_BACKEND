const mongoose = require("mongoose")

const createConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Mongoose connected ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error occured ${error.message}`);
        process.exit(1)
    }
}

module.exports = createConnection;