const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaById } = require('../helpers/db-validators');

const router = Router();


/**
 * * GET ALL CATEGORIES
 * * Obtener todas las categorias - publico
 *////
router.get('/', obtenerCategorias);



/**
 ** GET CATEGORY BY ID
 ** Obtener una categoria por id - publico
 *////
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], obtenerCategoriaPorId);



/**
 * * CREATE CATEGORY
 ** Crear categoría - privado - cualquier persona con un token válido
 *////
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);



/**
 * * UPDATE CATEGORY
 * * Actualizar categoría - privado - cualquier persona con un token válido
 *////
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], actualizarCategoria);




//* DELETE CATEGORY
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], borrarCategoria);



module.exports = router;