const { MongoClient }= require('mongodb');

let dbConnection;

const connectToDb = (cb) => {
    MongoClient.connect('mongodb://127.0.0.1:27017/mongo_tut')
        .then((client) => {
            dbConnection = client.db();
            return cb();
        })
        .catch (err => {
            console.log(err);
            return cb(err);
        })
};

module.exports = {
    connectToDb,
    getDb: () => dbConnection      
};