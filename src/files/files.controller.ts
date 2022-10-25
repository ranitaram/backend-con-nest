import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import {fileFilter, fileNamer} from './helpers'


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    ) {}


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string){
    const path = 
    this.filesService.getStaticProductImage(imageName);
    
    res.sendFile(path);
  }





  //instalar yarn add -D @types/multer 
  //para poder usar el file como argumento y usar el Multer
  @Post('product')
  //solo mandamos la referencia de la funcion no la estamos ejecutando con los parentesis
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    //limits: {filesize: 1000}
    storage: diskStorage({
      //el destination es donde yo quiero almacenar el archivo en el fileSystem
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
   @UploadedFile() file: Express.Multer.File){
    
    if (!file) {
      throw new BadRequestException(
        'asegurate que el archivo es una imagen');
    }

    //TODO:TEMPORAL
   // const secureUrl = `${file.filename}`;
   const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    };
  }
}
