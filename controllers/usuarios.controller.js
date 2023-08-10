const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


//* Usuario GET Controller
const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}


//* Usuario POST Controller
const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol
    });

    // Encriptar la contraseña 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en la BD
    await usuario.save();

    res.status(201).json({
        msg: 'post API - usuariosPost Controller',
        usuario
    })
}


//* Usuario PUT Controller
const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        // Encriptar la contraseña 
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario)
}


//* Usuario DELETE Controller
const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario);
}


//* Usuario PATCH Controller
const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - Controller'
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}