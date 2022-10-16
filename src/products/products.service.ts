import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dtos';
import { validate as isUUID} from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
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

      const { images = [], ...productDetails} = createProductDto;

      //esto solo crea el producto pero no lo guarda
      const product = 
      this.productRepository.create({
        ...createProductDto,
        images:images.map(image => this.productImageRepository
          .create({url: image}))
      });
      //y aqui para grabarlo e impactar la base de datos
      await this.productRepository.save(product);
      //y regreso el producto creado
      return {...product, images};
    
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

  async findOne(term: string) {

    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term});

    }else {
      //product = await this.productRepository.findOneBy({slug: term});
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
      .where(`UPPER(title) =:title or slug =:slug`,{
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      }).getOne();
    }

    // const product = await this.productRepository.findOneBy({id});
    if (!product) {
      throw new NotFoundException(`Producto con el id ${ term } no fue encontrado`);
    }
    return product; 
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //esto solo lo prepara para la actualizacion
    const product = await this.productRepository.preload({
      //buscate el id y cargate todas sus propiedades del objeto
      id: id,
      ...updateProductDto,
      //TODO: Temporal la parte de imagenes
      images: []
    });
    if (!product) throw new NotFoundException(`producto con id ${id} no fue encontrado`); 
    
    try {
      await this.productRepository.save(product);
      return product; 
      
    } catch (error) {
      this.handleDBExceptions(error);
    }


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
