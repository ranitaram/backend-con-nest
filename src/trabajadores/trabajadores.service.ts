import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTrabajadoreDto } from './dto/create-trabajadore.dto';
import { UpdateTrabajadoreDto } from './dto/update-trabajadore.dto';
import { Trabajador } from './entities/trabajadore.entity';
import { DataSource, Repository } from 'typeorm';
import {validate as isUUID} from 'uuid'
import { PaginationDto } from '../common/dtos/pagination.dtos';
import { TrabajadorImage } from './entities';

@Injectable()
export class TrabajadoresService {

  private readonly logger = new Logger('TrabajadoresService');

  constructor(
    @InjectRepository(Trabajador)
    private readonly trabajadorRepository: Repository<Trabajador>,

    @InjectRepository(TrabajadorImage)
    private readonly trabajadorImageRepository: Repository<TrabajadorImage>,

    private readonly dataSource: DataSource,

  ){}





  async create(createTrabajadoreDto: CreateTrabajadoreDto) {

    try {
      
      const {images = [], ...trabajadorDetails} = createTrabajadoreDto;
  
      const trabajador =
      this.trabajadorRepository.create({
        ...createTrabajadoreDto,
        images: images.map(image=> this.trabajadorImageRepository
          .create({url: image}))
      });
  
      await this.trabajadorRepository.save(trabajador);
  
      return {...trabajador, images};

    } catch (error) {
      this.handleDBExceptions(error);
    }
    
  }

  async findAll(paginationDto: PaginationDto) {
    
    const {limit = 10, offset = 0} = paginationDto;
    const trabajadores = await this.trabajadorRepository
    .find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return trabajadores.map(trabajador=> ({
      ...trabajador,
      images: trabajador.images.map(img => img.url)
    }));
  }

  async findOne(term: string) {
    let trabajador: Trabajador;
    if(isUUID(term)){
      trabajador = await this.trabajadorRepository
      .findOneBy({
        id: term
      });
    }else {
      const queryBuilder = this.trabajadorRepository
      .createQueryBuilder('trab');
      trabajador = await queryBuilder
      .where(`UPPER(nombre) =:nombre`,{
        nombre: term.toUpperCase(),
        
      })
      .leftJoinAndSelect('trab.images','trabImages')
      .getOne();
    }
    if (!trabajador) {
      throw new NotFoundException(`Trabajador con el nombre ${term} no fué encontrado`);

    }
    return trabajador;
  }

  async findOnePlain(term: string){
    const {images = [], ...trab} = await this.findOne(term);

    return {
     ...trab,
     images: images.map(image=> image.url)
    }
  }

  
  async update(id: string, updateTrabajadoreDto: UpdateTrabajadoreDto) {
    const {images,  ...toUpdate} = updateTrabajadoreDto;

    const trabajador = await this.trabajadorRepository.preload({
      id, ...toUpdate,
    });

    if(!trabajador) throw new NotFoundException(
    `trabajador con id ${id} no fue encontrado`
    );
    
    
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    

    try {

      if (images) {
        await queryRunner.manager.delete(
          TrabajadorImage, {trabajador: {id}})

          trabajador.images = images.map(
            image=> this.trabajadorImageRepository
            .create({url: image})
          )
      } else {

      }

      await queryRunner.manager.save(trabajador);
      await queryRunner.release();
      
      return this.findOnePlain(id);
    } catch (error) {
      
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const trabajador = await this.findOne(id);
    await this.trabajadorRepository.remove(trabajador)
  }

  private handleDBExceptions(error: any){

    if (error.code === '23505') 
    
    throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    )
  }

  async deleteAllTrabajadores(){
    const query = this.trabajadorRepository
    .createQueryBuilder('trabajador');

    try {
      return await query
      .delete()
      .where({})
      .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
