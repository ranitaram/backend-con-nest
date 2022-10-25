
//funcion que tenga que ser aceptada por el fileInterceptor
export const fileFilter = (
    req: Express.Request, 
    file: Express.Multer.File,
    callback: Function 
    ) => {

// console.log({file})
//aqui evaluamos el archivo
if (!file) return callback(new Error('File is empty'), false);

        const fileExtension = file.mimetype.split('/')[1];
        const validExtensions = ['jpg','jpeg','png','gif'];

        if(validExtensions.includes(fileExtension)){
            return callback(null,true)
        }



        callback(null, true)
}