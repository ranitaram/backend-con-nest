import { Module } from '@nestjs/common';
import { TrabajadoresService } from './trabajadores.service';
import { TrabajadoresController } from './trabajadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajadorImage, Trabajador } from './entities';

@Module({
  controllers: [TrabajadoresController],
  providers: [TrabajadoresService],
  imports: [
    TypeOrmModule.forFeature(
      [Trabajador, TrabajadorImage])],
  //exporto mi servicio para poderlo usar en otros modulos    
  //tambien exporto mis 2 repositorios de una vez por si los necesito mas adelante
  exports: [
    TrabajadoresService,
    TypeOrmModule
  ]    
})
export class TrabajadoresModule {}
