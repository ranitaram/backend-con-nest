import { IsArray, IsOptional, IsString, MinLength } from "class-validator";


export class CreateTrabajadoreDto {

    @IsString()
    @MinLength(3)
    nombre: string;

    @IsString()
    @MinLength(3)
    primerApellido: string;

    @IsString()
    @MinLength(3)
    segundoApellido: string;

    @IsString()
    @MinLength(2)
    oficioOprofesion: string;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[];
}
