const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./Routes/Routes');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use('/uploads', express.static('uploads'));


// Asegúrate de que la carpeta de carga exista
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
app.use("/api",routes);