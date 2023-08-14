const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');


// --------
// USUARIOS
// --------

/**
 * Verifica si el rol es válido.
 * @param {*} rol 
 */
const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la aplicación.`);
    }
}


/**
 * Verifica si existe un usuario con el correo especificado.
 * @param {*} correo 
 */
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado en la aplicación. Por favor pruebe con un correo diferente.`);
    }
}


const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe.`);
    }
}
// -----------
// CATEGORÍAS
// -----------

/**
 * Verifica si existe una categoría con el id especificado.
 * @param {*} id 
 */
const existeCategoriaById = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoría con el id ${id} no existe.`);
    }
}


// -----------
// PRODUCTOS
// -----------

/**
 * Verifica si existe un producto con el id especificado.
 * @param {*} id 
 */
const existeProductoById = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto con el id ${id} no existe.`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaById,
    existeProductoById
}