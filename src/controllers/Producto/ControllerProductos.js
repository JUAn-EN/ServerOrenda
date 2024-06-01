const { pool } = require("../../Config/db");
const multer = require('multer');

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Nombre de archivo único
  }
});

const upload = multer({ storage: storage });

exports.upload = multer({ storage: storage });
exports.createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;

    // Verificar si se envió un archivo de imagen
    if (!req.file) {
      return res.status(400).json({ message: "Debe adjuntar una imagen" });
    }

    const imagenPath = req.file.path; // Obtener la ruta de la imagen subida
    const host = req.get('host');
    const imagenUrl = `${req.protocol}://${host}/${imagenPath}`; // URL completa de la imagen

    // Insertar producto en la base de datos con la URL de la imagen
    const [insertProducto] = await pool.promise().query(
      "INSERT INTO Productos (nombre, descripcion, precio, imagen, categoria) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, imagenUrl, categoria]
    );

    if (insertProducto.affectedRows) {
      return res.status(200).json({ message: "Producto creado exitosamente" });
    } else {
      return res.status(500).json({ message: "No se ha podido crear el producto" });
    }
  } catch (error) {
    console.error('Error en el controlador de creación de producto:', error);
    return res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};


exports.getAllProductos = async (req, res) => {
  try {
    // Consultar todos los productos en la base de datos
    const [productos] = await pool.promise().query("SELECT * FROM Productos");

    // Verificar si se encontraron productos
    if (productos.length > 0) {
      return res.status(200).json({ productos });
    } else {
      return res.status(404).json({ message: "No se encontraron productos" });
    }
  } catch (error) {
    console.error('Error en el controlador de consulta de productos:', error);
    return res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};