import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { Material } from './entities/materiale.entity';


@Injectable()
export class MaterialesService {

  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>){}

  async create(createMaterialeDto: CreateMaterialeDto) {
   try {
     const material = this.materialRepository.create(createMaterialeDto);

     await this.materialRepository.save(material);
     return material;
   } catch (error) {
     console.log(error)
     throw new InternalServerErrorException('ayudenmee')
   }
  }

  findAll() {
    return `This action returns all materiales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materiale`;
  }

  update(id: number, updateMaterialeDto: UpdateMaterialeDto) {
    return `This action updates a #${id} materiale`;
  }

  remove(id: number) {
    return `This action removes a #${id} materiale`;
  }
}
