import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { PaginationDto } from '../common/dtos/pagination.dtos';

@Controller('materiales')
export class MaterialesController {
  constructor(private readonly materialesService: MaterialesService) {}

  @Post()
  create(@Body() createMaterialeDto: CreateMaterialeDto) {
    return this.materialesService.create(createMaterialeDto);
  }

  @Get()
  findAll(@Query()paginationDto: PaginationDto) {
    return this.materialesService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.materialesService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialeDto: UpdateMaterialeDto) {
    return this.materialesService.update(+id, updateMaterialeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.materialesService.remove(id);
  }
}
