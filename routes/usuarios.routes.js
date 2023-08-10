const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios.controller');

const router = Router();


//* Usuarios GET
router.get('/', usuariosGet)


//* Usuarios PUT
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut)


//* Usuarios POST
router.post('/', [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('password', 'El password debe tener al menos 6 caracteres.').isLength({ min: 6 }),
    check('correo', 'El tipo de formato del correo no es válido.').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol válido.').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost)


//* Usuarios DELETE
router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)


//* Usuarios PATCH
router.patch('/', usuariosPatch)



module.exports = router;