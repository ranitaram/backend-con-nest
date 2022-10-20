import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { MaterialesModule } from './materiales/materiales.module';

import { CommonModule } from './common/common.module';
import { TrabajadoresModule } from './trabajadores/trabajadores.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';


@Module({
  imports: [
    //para establecer nuestras variables de entorno
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: 'postgres',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ProductsModule,

    MaterialesModule,

   

    CommonModule,

   

    TrabajadoresModule,

   

    SeedModule,

   

    FilesModule
  ],
  
})
export class AppModule {}
