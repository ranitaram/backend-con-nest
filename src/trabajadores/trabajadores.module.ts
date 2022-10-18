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
      [Trabajador, TrabajadorImage])]
})
export class TrabajadoresModule {}
