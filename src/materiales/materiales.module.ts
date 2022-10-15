import { Module } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { MaterialImage } from './entities';

@Module({
  controllers: [MaterialesController],
  providers: [MaterialesService],
  imports: [
    TypeOrmModule.forFeature([Material, MaterialImage])
  ]
})
export class MaterialesModule {}
