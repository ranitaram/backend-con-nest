import { Injectable } from '@nestjs/common';
import { TrabajadoresService } from '../trabajadores/trabajadores.service';


@Injectable()
export class SeedService {

  constructor(
    private readonly trabajadoresService: TrabajadoresService
  ){}
  
  async runSeed(){

    await this.insertNewTrabajadores();

    return 'SEED EXECUTED';
  }

  private async insertNewTrabajadores(){
    await this.trabajadoresService.deleteAllTrabajadores()

    return true;
  }
}

