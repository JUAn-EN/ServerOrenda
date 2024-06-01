const jwt = require('jsonwebtoken');
const { pool } = require('../Config/db');
const util = require('util');
const secretKey = process.env.SECRET_KEY;

const query = util.promisify(pool.query).bind(pool);

exports.loginUser = async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        console.log('Datos recibidos para iniciar sesión:', req.body);

        if (!email || !contrasena) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const rows = await query("SELECT * FROM Usuario WHERE correo_electronico = ?", [email]);
        const user = rows[0];
        console.log('Resultado de la consulta a la base de datos:', user);

        if (!user) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        const passwordMatch = contrasena === user.contraseña;
        console.log('Resultado de la comparación de contraseñas:', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        const usuarioId = user.id;
        const token = jwt.sign({ usuarioId, rol: user.rol }, secretKey, { expiresIn: '1h' });

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.correo_electronico,
                fotoUsuario: user.fotoUsuario,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en el controlador de inicio de sesión:', error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
