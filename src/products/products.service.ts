import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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

    private readonly dataSource: DataSource,
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
  async findAll(paginationDto: PaginationDto) {
    //desestructurar
    const { limit = 10, offset = 0} = paginationDto;
    const products= await this.productRepository.find({
      take: limit, //toma el limite
      skip: offset, //saltate lo que diga el offset
      relations: {
        images: true,
      }
    });

    //regresamos un objeto implicito
    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }) )
  }

  async findOne(term: string) {

    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term});

    }else {
      //product = await this.productRepository.findOneBy({slug: term});
      //el prod seria un alias para la tabla
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
      .where(`UPPER(title) =:title or slug =:slug`,{
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      })
      //tambien le tenemos que poner un alias a la tabla de imagnes del producto
      .leftJoinAndSelect('prod.images','prodImages')
      .getOne();
    }

    // const product = await this.productRepository.findOneBy({id});
    if (!product) {
      throw new NotFoundException(`Producto con el id ${ term } no fue encontrado`);
    }
    return product; 
  }

  async findOnePlain(term: string){
    const {images = [], ...prod} = await this.findOne(term);
    return {
      ...prod,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    //esta es la data que va a actualizar sin las imagenes
    const {images, ...toUpdate} = updateProductDto;

    //esto solo lo prepara para la actualizacion
    const product = await this.productRepository.preload({
      //buscate el id y cargate todas sus propiedades del objeto
       id,  ...toUpdate,
    });
    
    if (!product) throw new NotFoundException(`producto con id ${id} no fue encontrado`); 
    
    //tenemos que evaluar si vienen las imagenes
    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    //para conectar a la base de datos y hacer la transaccion
    await queryRunner.connect();
    //inicializamos nuestro objeto
    await queryRunner.startTransaction();

    

    try {
      //evaluamos si vienen imagenes para eliminarsi es que vienen
      if(images){
        //aqui nos pide a que tabla queremos afectar para eliminar
        //y luego el criterio
        await queryRunner.manager.delete(ProductImage, {product: {id}})
        //ya con esto borramos las imagenes anteriores
        product.images = images.map(
          image => this.productImageRepository
          .create({url: image})
        )
      } else {

      }

      await queryRunner.manager.save(product);

      //aqui abajo hace el commit de la transaccion
      //despues de usar el release, este se desconecta y ya no funciona
      await queryRunner.release();


      
      //await this.productRepository.save(product);
      return this.findOnePlain(id);
      
    } catch (error) {
      //para revertir los cambios si algo sale mal
      //dejamos los query runner afuera para poderlos usar bien en el try y catch
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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
