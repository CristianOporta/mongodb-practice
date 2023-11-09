const express = require('express');
const { connectToDatabase, getDatabase, closeDatabaseConnection } = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// db connection
let db;


// Conecta a la base de datos al iniciar la aplicación
connectToDatabase((error) => {
    if (!error) {
        app.listen(port, () => {
            console.log(`Servidor Express está corriendo en el puerto ${port}`);
        })
        db = getDatabase();
    }
});

// ----------------------------------------------------------------------------


app.get('/people', async (req, res) => {
    try {
        const people = await db.collection('people')
            .find()
            .toArray();

        res.status(200).json(people);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch the documents' });
    }
});






// Cierra la conexión a la base de datos cuando la aplicación se detiene
process.on('SIGINT', () => {
    closeDatabaseConnection();
    process.exit();
});
