//!npm install mongoose node-cron

const mongoose = require('mongoose');
const cron = require('node-cron');

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
    console.log('Conexión a la base de datos exitosa.');

    // Definición del esquema para la colección
    const schema = new mongoose.Schema({
        nombre: String,
        descripción: String,
        fechaCreación: Date,
        localidad: String,
    });

    const Colección = mongoose.model('Colección', schema);

    // Tarea programada para ejecutar cada 24 horas
    cron.schedule('0 0 */24 * * *', async () => {
        try {
            // Crear un nuevo documento en la colección
            const nuevoElemento = new Colección({
                nombre: 'Ejemplo',
                descripción: 'Esto es un ejemplo',
                fechaCreación: new Date(),
                localidad: 'EjemploCity',
            });

            // Guardar el documento en la base de datos
            await nuevoElemento.save();
            console.log('Elemento guardado en la base de datos.');
        } catch (error) {
            console.error('Error al guardar el elemento:', error);
        }
    });
});
