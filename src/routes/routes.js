const express = require('express')

const authRoutes = require('./authRoute.js')
const dashboardRoutes = require('./dashboardRoutes.js')
const sedesRoutes = require('./sedeRouter.js')
const uenRoutes = require('./uenRoutes.js')
const mfRoutes = require('./mfRoutes.js')
const empleadosRoutes = require('./empleadosRoutes.js')
const depRoutes = require('./depRoutes.js')
const autoRoutes = require('./autoevaluacionRoutes.js')
const parRoutes = require('./parRoutes.js')
const liderRoutes = require('./liderRoutes.js')
const compRoutes = require('./competenciasRoutes.js')
const usersRoutes = require('./usersRoutes.js')
const resultsRoutes = require('./resultsRoutes.js')

const {verifyToken} = require('../token/verifyToken.js')
const router = express.Router();
const baseURL = "api/v5"

router.use(`/${baseURL}/auth`, authRoutes)
router.use(`/${baseURL}/dashboard`, dashboardRoutes)
router.use(`/${baseURL}/sedes`, sedesRoutes)
router.use(`/${baseURL}/uen`, uenRoutes)
router.use(`/${baseURL}/mf`, mfRoutes)
router.use(`/${baseURL}/emp`, empleadosRoutes)
router.use(`/${baseURL}/dep`, depRoutes)
router.use(`/${baseURL}/auto`, autoRoutes)
router.use(`/${baseURL}/par`, parRoutes)
router.use(`/${baseURL}/lider`, liderRoutes)
router.use(`/${baseURL}/comp`, compRoutes)
router.use(`/${baseURL}/users`, usersRoutes)
router.use(`/${baseURL}/results`, resultsRoutes)








module.exports = router;