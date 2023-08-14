const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'producto-por-categoria',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // TRUE

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            total: (usuario) ? 1 : 0,
            results: (usuario) ? [usuario] : []
        });
    }
    const terminoRegex = new RegExp(termino, 'i'); // 'i' es para que no sea case sensitive

    const query = {
        $or: [{ nombre: terminoRegex }, { correo: terminoRegex }],
        $and: [{ estado: true }]
    };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        total,
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino)
            .populate('usuario', 'nombre');

        return res.json({
            total: (categoria) ? 1 : 0,
            results: (categoria) ? [categoria] : []
        });
    }
    const terminoRegex = new RegExp(termino, 'i');

    const query = {
        nombre: terminoRegex,
        estado: true
    };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
    ]);

    res.json({
        total,
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre');

        return res.json({
            total: (producto) ? 1 : 0,
            results: (producto) ? [producto] : []
        });
    }
    const terminoRegex = new RegExp(termino, 'i');

    const query = {
        nombre: terminoRegex,
        estado: true
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre'),
    ]);

    res.json({
        total,
        results: productos
    });
}

const buscarProductosPorCategoria = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.find({ categoria: termino }, { estado: true })
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    if (!categorias.length) {
        return res.status(400).json({
            msg: `No hay resultados de categorias para el termino: ${termino}`
        })
    }

    const query2 = {
        $or: [...categorias.map(c => { return { categoria: c._id } })],
        $and: [{ estado: true }]
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query2),
        Producto.find(query2).
            populate('categoria', 'nombre')

    ])

    res.json({
        total,
        results: productos
    })

}

const buscar = async (req = request, res = response) => {

    const { coleccion, termino } = req.params; // :coleccion/:termino

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {

        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'producto-por-categoria':
            buscarProductosPorCategoria(termino, res);

            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            });
    }
}





module.exports = {
    buscar
}