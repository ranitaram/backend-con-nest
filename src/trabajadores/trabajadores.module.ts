import { Module } from '@nestjs/common';
import { TrabajadoresService } from './trabajadores.service';
import { TrabajadoresController } from './trabajadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trabajador } from './entities/trabajadore.entity';

@Module({
  controllers: [TrabajadoresController],
  providers: [TrabajadoresService],
  imports: [
    TypeOrmModule.forFeature(
      [Trabajador])]
})
export class TrabajadoresModule {}
