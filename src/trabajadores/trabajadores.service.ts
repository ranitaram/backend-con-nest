import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  constructor(
    @InjectRepository(Trabajador)
    private readonly trabajadorRepository: Repository<Trabajador>,

    @InjectRepository(TrabajadorImage)
    private readonly trabajadorImageRepository: Repository<TrabajadorImage>,

    private readonly dataSource: DataSource,

  ){}





  create(createTrabajadoreDto: CreateTrabajadoreDto) {
    return 'This action adds a new trabajadore';
  }

  async findAll(paginationDto: PaginationDto) {
    return `This action returns all trabajadores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trabajadore`;
  }

  update(id: number, updateTrabajadoreDto: UpdateTrabajadoreDto) {
    return `This action updates a #${id} trabajadore`;
  }

  remove(id: number) {
    return `This action removes a #${id} trabajadore`;
  }

  private handleDBExceptions(error: any){

    if (error.code === '23505') 
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }
}
