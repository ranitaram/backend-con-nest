import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dtos';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}
  
  async create(createProductDto: CreateProductDto) {
    try {

      // if (!createProductDto.slug) {
      //   createProductDto.slug = createProductDto.title
      //   .toLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'')
      // } else {
      //   createProductDto.slug = createProductDto.slug
      //   .toLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'')
      // }



      //esto solo crea el producto pero no lo guarda
      const product = 
      this.productRepository.create(createProductDto);
      //y aqui para grabarlo e impactar la base de datos
      await this.productRepository.save(product);
      //y regreso el producto creado
      return product;
    
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //TODO: Paginar, para no regresar cientos de productos si llegaramos a tenerlos
  findAll(paginationDto: PaginationDto) {
    //desestructurar
    const { limit = 10, offset = 0} = paginationDto;
    return this.productRepository.find({
      take: limit, //toma el limite
      skip: offset, //saltate lo que diga el offset
      //TODO: relaciones
    });
  }

  async findOne(id: string) {

    const product = await this.productRepository.findOneBy({id});
    if (!product) {
      throw new NotFoundException(`Producto con el id ${ id } no fue encontrado`);
    }
    return product; 
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any){
    if (error.code === '23505') 
    throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
      
    
  }
}
