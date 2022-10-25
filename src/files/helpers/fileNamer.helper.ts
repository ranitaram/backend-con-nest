import {v4 as uuid} from 'uuid'
//funcion que tenga que ser aceptada por el fileInterceptor
export const fileNamer = (
    req: Express.Request, 
    file: Express.Multer.File,
    callback: Function 
    ) => {

// console.log({file})
//aqui evaluamos el archivo
if (!file) return callback(new Error('File is empty'), false);

       const fileExtension = file.mimetype.split('/')[1];

       //le pasamos un uuid para que e nombre del archivo sea unico siempre, y luego la extension
       const fileName = `${uuid()}.${fileExtension}`;



        callback(null, fileName)
}