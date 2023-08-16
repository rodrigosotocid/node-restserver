const path = require('path');
const { v4: uuidv4 } = require('uuid');


const extDefault = ['png', 'jpg', 'jpeg', 'gif'];

const subirArchivo = (files, extensionesValidas = extDefault, carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida. Extensiones válidas: ${extensionesValidas}.`);
        }

        const newName = `${uuidv4()}.${extension}`;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, newName);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(newName);
        });
    });


}

module.exports = {
    subirArchivo
}