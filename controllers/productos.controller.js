const { response, request } = require('express');
const { Producto, Categoria } = require("../models");


//* GET ALL PRODUCTS
const obtenerProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

//* GET PRODUCT BY ID
const obtenerProdutoPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
}


//* CREATE PRODUCT
const crearProducto = async (req = request, res = response) => {

    const { estado, usuario, nombre, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }

    const data = {
        ...body,
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);
}


//* UPDATE PRODUCT
const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.json(producto);
}


//* DELETE PRODUCT
const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(201).json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProdutoPorId,
    actualizarProducto,
    borrarProducto
}