import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TrabajadoresModule } from '../trabajadores/trabajadores.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  //importo mi modulo de trabajadores y no el servicio
  imports:[
    TrabajadoresModule,
    ProductsModule
  ]
})
export class SeedModule {}
