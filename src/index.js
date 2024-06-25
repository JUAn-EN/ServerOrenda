const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./Routes/Routes');

// Lista de orígenes permitidos
const allowedOrigins = [
    'http://localhost:4200',
    'https://dancing-chimera-be7edd.netlify.app/'  // Reemplaza con tu dominio de Netlify
];

app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como las realizadas por herramientas como Postman)
        if (!origin) return callback(null, true);

        // Verificar si el origen de la solicitud está en la lista de orígenes permitidos
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `El origen ${origin} no está permitido por la política CORS.`;
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use('/uploads', express.static('uploads'));

// Asegúrate de que la carpeta de carga exista
const fs = require('fs');
const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Carpeta de carga creada:', uploadDir);
} else {
    console.log('La carpeta de carga ya existe:', uploadDir);
}

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; object-src 'self' uploads/;");
    next();
});

// Después de tus rutas
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

module.exports = app;
app.use("/api", routes);
