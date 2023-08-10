const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;
    const message = 'Usuario / Password no son correctos.';

    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: message
            });
        }

        if (!usuario.estado) {
            return res.status(400).json({
                msg: message
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: message
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = { login }