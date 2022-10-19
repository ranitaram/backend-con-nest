import { Injectable } from '@nestjs/common';


@Injectable()
export class SeedService {
  
  async runSeed(){

    await this.insertNewTrabajadores();

    return 'SEED EXECUTED';
  }

  private async insertNewTrabajadores(){
    //this.trabajadoresService.deleteAllTrabajadores()

    return true;
  }
}

