// routes.js
const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/Producto/ControllerProductos');
const epayco = require('../controllers/pasarela/pasarela');
const AuthController = require('../controllers/controllerUsuarios');
const multer = require('multer'); // Asegúrate de importar multer

router.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenidos a la api de nuestra tienda"
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Nombre de archivo único
    }
});

const upload = multer({ storage: storage });

router.post('/CrearProducto', upload.single('imagen'), ProductoController.createProducto);
router.get('/ObtenerProductos', ProductoController.getAllProductos);
router.post('/create-payment', async (req, res) => {
    const { amount, description, currency, email, tokenCard, customerId, doc_number, name, last_name, cell_phone } = req.body;

    try {
        const paymentData = {
            token_card: tokenCard,
            customer_id: customerId,
            doc_type: 'CC',
            doc_number: doc_number,
            name: name,
            last_name: last_name,
            email: email,
            cell_phone: cell_phone,
            bill: 'OR-1234',
            description: description,
            value: amount,
            tax: '0',
            tax_base: amount,
            currency: currency,
            dues: '1'
        };

        const paymentResponse = await epayco.charge.create(paymentData);
        res.json(paymentResponse);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', AuthController.loginUser);

module.exports = router;
