const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://127.0.0.1:27017/people'; // Cambia esto con la URL de tu base de datos

let client;
let dbConnection;

const connectToDatabase = async (cb) => {
    try {
        client = await MongoClient.connect(mongoUrl);
        console.log('Conectado a MongoDB');
        dbConnection = client.db();
        return cb();
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        return cb(error);
    }
};

const getDatabase = () => dbConnection;

const closeDatabaseConnection = () => {
    if (client) {
        client.close();
        console.log('Conexión cerrada');
    }
};

module.exports = { connectToDatabase, getDatabase, closeDatabaseConnection };
