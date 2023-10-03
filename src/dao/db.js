const mongoose = require('mongoose');


const DB_URL = "mongodb+srv://mansillaagustin6:<Supernova2576>@cluster0.cxzkttl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";


const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión a la base de datos establecida.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
    }
};

module.exports = connectDB;
