import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { Material } from './entities/materiale.entity';
import { PaginationDto } from '../common/dtos/pagination.dtos';
import {validate as isUUID} from 'uuid';


@Injectable()
export class MaterialesService {

  private readonly logger = new Logger('MaterialesService');

  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>){}

  async create(createMaterialeDto: CreateMaterialeDto) {
   try {
     const material = this.materialRepository.create(createMaterialeDto);

     await this.materialRepository.save(material);
     return material;
   } catch (error) {
     this.handleDBExceptions(error);
   }
  }

  findAll(pagnationDto: PaginationDto) {
    const {limit = 10, offset = 5} = pagnationDto
    return this.materialRepository.find({
      take: limit,
      skip: offset
      //TODO: relaciones
    });
  }

  async findOne(term: string) {
    let material : Material;

    if (isUUID(term)) {
      material = await this.materialRepository.findOneBy({id: term})
    }
    else {
      //TODO Agregar mas atributos cuando haga la clase trabajador
      const queryBuilder = this.materialRepository.createQueryBuilder();
      material = await queryBuilder
      .where(`UPPER(title) =:title`,{
        title: term.toUpperCase()
      }).getOne();
    }
    
    // const material = await this.materialRepository.findOneBy({id});
    if (!material) {
      throw new NotFoundException(`Producto con el id ${term} no fue encontrado`);
    }
    return material;
  }

  update(id: number, updateMaterialeDto: UpdateMaterialeDto) {
    return `This action updates a #${id} materiale`;
  }

  async remove(id: string) {
    const material = await this.findOne(id);

    await this.materialRepository.remove(material);
  }

  //para el manejo de errores
  private handleDBExceptions(error: any){
    if (error.code === '23505') 
    throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
}
}
