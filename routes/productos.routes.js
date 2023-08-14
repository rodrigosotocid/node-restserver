const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const {
    crearProducto,
    borrarProducto,
    obtenerProductos,
    obtenerProdutoPorId,
    actualizarProducto
} = require('../controllers/productos.controller');
const { existeProductoById, existeCategoriaById } = require('../helpers/db-validators');


const router = Router();

// -------------------------------------------------------------------------------------

/**
 * * GET ALL PRODUCTS
 *////
router.get('/', obtenerProductos);

// -------------------------------------------------------------------------------------

/**
 ** GET PRODUCT BY ID
 *////
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], obtenerProdutoPorId);

// -------------------------------------------------------------------------------------

/**
 * * CREATE PRODUCT
 */
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo válido').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], crearProducto);

// -------------------------------------------------------------------------------------

/**
 * * UPDATE PRODUCT
 *////
router.put('/:id', [
    validarJWT,
    check('categoria', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], actualizarProducto);

// -------------------------------------------------------------------------------------

/**
 * * DELETE PRODUCT
 *////
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], borrarProducto);


module.exports = router;