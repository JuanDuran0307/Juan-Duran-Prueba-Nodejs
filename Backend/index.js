const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const routerBase = require('./routes/routes.js');

dotenv.config();

const app = express();

app.use('/market', routerBase);


const port = process.env.PORT;
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

connection.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
        process.exit(1); 
    }
    console.log("Conexión exitosa a la base de datos");
});

app.listen(port, ()=>{
    console.log("sevidor lanzado en el puerto:",port)
    })


module.exports = connection;
