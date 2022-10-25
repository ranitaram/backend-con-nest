import { Injectable } from '@nestjs/common';
import { TrabajadoresService } from '../trabajadores/trabajadores.service';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';



@Injectable()
export class SeedService {

  constructor(
   // private readonly trabajadoresService: TrabajadoresService
   private readonly productsService: ProductsService
  ){}
  
  async runSeed(){

    await this.insertNewTrabajadores();

    return 'SEED EXECUTED';
  }

  private async insertNewTrabajadores(){
   // await this.trabajadoresService.deleteAllTrabajadores()
    await this.productsService.deleteAllProducts();

    const seedProducts = initialData.products;

    const insertPromises = [];
    //aqui barremos nuestros productos
    seedProducts.forEach(seedProduct=> {
      //insertamos la promesa
     insertPromises.push( this.productsService.create(seedProduct));
    });
    //espera a que todas las promsesas se resuelvan
    await Promise.all(insertPromises);
    return true;
  }
}

