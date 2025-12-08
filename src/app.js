
const express = require('express')
const config = require('./config')
const routes = require('./routes/routes.js')
const cors = require('cors')
const { Server } = require('socket.io');
const http = require('http')

let peso
let port1
let peso2
let port1_2

const app = express()


// settings
app.set('port', config.port)
http.listen

//midelwars
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(routes)
app.use('/uploads', express.static('uploads'));
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
})
const io = new Server(server, {
    cors: { origin: '*', credentials: false },
});

// const generatePDF = require('./controllers/generearPdf.js');
// const path = require('path');

// const data = {
//   nombreEmpleado: 'Alejandro Muñoz Rodríguez',
//   cedulaEmpleado: '1039473558',
//   periodoEvaluado: 'Enero a Diciembre 2024',
//   cargoEmpleado: 'Desarrollador de Software',
// };

// generatePDF(
//   data,
//   path.join(__dirname, '/templates/tercero', 'PruebaEvaluaciones.html'),
//   path.join(__dirname, '/outputs', 'Alejo.pdf')
// );


module.exports = app;