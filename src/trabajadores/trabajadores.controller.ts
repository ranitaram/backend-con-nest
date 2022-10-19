import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { TrabajadoresService } from './trabajadores.service';
import { CreateTrabajadoreDto } from './dto/create-trabajadore.dto';
import { UpdateTrabajadoreDto } from './dto/update-trabajadore.dto';
import { PaginationDto } from '../common/dtos/pagination.dtos';

@Controller('trabajadores')
export class TrabajadoresController {
  constructor(private readonly trabajadoresService: TrabajadoresService) {}

  @Post()
  create(@Body() createTrabajadoreDto: CreateTrabajadoreDto) {
    return this.trabajadoresService.create(createTrabajadoreDto);
  }

  @Get()
  findAll(@Query()paginationDto: PaginationDto) {
    return this.trabajadoresService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.trabajadoresService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrabajadoreDto: UpdateTrabajadoreDto) {
    return this.trabajadoresService.update(+id, updateTrabajadoreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trabajadoresService.remove(id);
  }
}
