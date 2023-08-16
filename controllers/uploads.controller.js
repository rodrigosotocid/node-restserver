const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');



//***********************************
//* Subir archivo POST - Controller *
//***********************************

const cargarArchivo = async (req = request, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre })

    } catch (msg) {
        res.status(400).json({
            msg
        });
    }
}


//****************************************
//* Actualizar archivo PUT - Controller *
//****************************************

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}.`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Actualmente no existe una validación para esto.'
            });
    }

    // Limpiar imágenes previas

    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);
    }

    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    modelo.save();

    res.json({
        modelo
    });
}

//****************************************
//* Actualizar archivo PUT - Controller *
//****************************************

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}.`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Actualmente no existe una validación para esto.'
            });
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;

    const resp = await cloudinary.uploader.upload(tempFilePath);
    const { secure_url } = resp;

    modelo.img = secure_url;
    modelo.save();

    res.json({
        modelo
    });
}


//************************************
//* Obtener archivo GET - Controller *
//************************************

const mostrarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}.`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Actualmente no existe una validación para esto.'
            });
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) return res.sendFile(pathImagen);
    }

    const defaultPathImage = path.join(__dirname, '../assets/no-image.jpg');
    console.log(defaultPathImage);
    res.sendFile(defaultPathImage);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}