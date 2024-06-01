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


module.exports = app;
app.use("/api",routes);