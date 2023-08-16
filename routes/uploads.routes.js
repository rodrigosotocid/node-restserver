const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

//******************************
//* Subir archivo POST - Route *
//******************************

router.post('/', validarArchivoSubir, cargarArchivo);


//**********************************
//* Actualizar archivo PUT - Route *
//**********************************

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo.').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);


//*******************************
//* Obtener archivo GET - Route *
//*******************************

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo.').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);


module.exports = router;