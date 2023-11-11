const express = require('express');
const { connectToDatabase, getDatabase, closeDatabaseConnection } = require('./db');
const { ObjectId } = require('mongodb');

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

// Llamando a todos las personas
app.get('/people', async (req, res) => {
    // Paginación  
    const page = req.query.p || 0;
    const peoplePerPage = 3;

    try {
        const people = await db.collection('people')
            .find()
            .skip(page * peoplePerPage)
            .limit(peoplePerPage)
            .toArray();

        res.status(200).json(people);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch the documents.' });
    }
});

// Llamando a solamente una persona
app.get('/people/:id', async (req, res) => {
    try {
        const person = await db.collection('people')
            .findOne({ _id: new ObjectId(req.params.id) });

        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch the document.' });
    }
});



// Registrando una persona
app.post('/people', (req, res) => {
    try {
        const person = req.body;

        db.collection('people')
            .insertOne(person);

        res.status(201).send("Created successfully!");

    } catch (error) {
        res.status(500).json({ error: 'Could not register the document.' });
    }
});


app.delete('/people/:id', async (req, res) => {
    try {
        await db.collection('people')
            .deleteOne({ _id: new ObjectId(req.params.id) });

        res.status(200).send("Deleted successfully!");
    } catch (error) {
        res.status(500).json({ error: 'Could not delete the document.' });
    }
});


app.patch('/people/:id', async (req, res) => {
    const updates = req.body;
    try {
        await db.collection('people')
            .updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates});

        res.status(200).send("Updated successfully!");
    } catch (error) {
        res.status(500).json({ error: 'Could not update the document.' });
    }
});



// Cierra la conexión a la base de datos cuando la aplicación se detiene
process.on('SIGINT', () => {
    closeDatabaseConnection();
    process.exit();
});
