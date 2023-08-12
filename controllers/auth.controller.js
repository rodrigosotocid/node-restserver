const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

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


const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });

        //* crear usuario
        if (!usuario) {
            const data = {
                nombre,
                correo,
                img,
                password: ':P',
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //* Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //* Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            msg: `El Token de Google no se pudo verificar. Error: ${error.message}`
        });
    }
}


module.exports = {
    login,
    googleSignIn
}