const express = require("express");
const app = express();
const mysql = require("mysql")
const router = express.Router();
require ('dotenv').config();


app.use(express.json());


router.get('/primerasolicitud',(req,res)=>{
    res.send('primer endpoint funcional');
    
})


router.post('/createproduct', (req, res) => {
    if (!req.body || typeof req.body !== 'object' || !req.body.estado) {
        res.status(400).json({ error: 'Cuerpo de solicitud inválido' });
        return;
    }

    const { estado, kit, barcode, nombre, presentacion, descripcion, foto, peso } = req.body;
    const query = "INSERT INTO productos (estado, kit, barcode, nombre, presentacion, descripcion, foto, peso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    connection.query(query, [estado, kit, barcode, nombre, presentacion, descripcion, foto, peso], (err, results) => {
        if (err) {
          console.error('Error al insertar el producto:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
        }
    
        console.log('Producto almacenado correctamente');
        res.status(201).json({ message: 'Producto almacenado correctamente' });
    });
});
router.post('/asociarProductoTienda', (req, res) => {
    const { id_producto, id_tienda, valor, compra_maxima } = req.body;

    // Validaciones
    if (!id_producto || !id_tienda || !valor || !compra_maxima || isNaN(compra_maxima)) {
        return res.status(400).json({ error: 'Datos de entrada no válidos' });
    }

    // Verificar si el producto y la tienda existen
    const checkExistenceQuery = 'SELECT COUNT(*) AS count FROM productos WHERE id = ?; SELECT COUNT(*) AS count FROM tiendas WHERE id = ?';
    connection.query(checkExistenceQuery, [id_producto, id_tienda], (err, results) => {
        if (err) {
            console.error('Error al verificar la existencia:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        const [productosCount, tiendasCount] = results;

        if (productosCount[0].count === 0 || tiendasCount[0].count === 0) {
            return res.status(404).json({ error: 'Producto o tienda no encontrado' });
        }

        // Insertar en la tabla tiendas_productos
        const insertQuery = 'INSERT INTO tiendas_productos (id_producto, id_tienda, valor, compra_maxima) VALUES (?, ?, ?, ?)';
        connection.query(insertQuery, [id_producto, id_tienda, valor, compra_maxima], (err, results) => {
            if (err) {
                console.error('Error al insertar en tiendas_productos:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            console.log('Producto asociado a la tienda correctamente');
            res.status(201).json({ message: 'Producto asociado a la tienda correctamente' });
        });
    });
});




module.exports = router;