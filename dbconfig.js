const mongoose = require('mongoose');


require('dotenv').config();

const uri = process.env.MONGODB_URI

const connection = async () => {
    try {
        await mongoose.connect(uri)
        console.log('Mongodb connected...');
    } catch (err) {
        console.log(err.message);
        process.exit(1)
    }
}

// connectDatabase();

// store = new MongoDBStore({
//     mongooseConnection: mongoose.connection,
//     collection: 'sessions'
// })

module.exports = { connection }