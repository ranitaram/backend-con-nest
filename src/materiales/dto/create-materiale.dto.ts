import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateMaterialeDto {
    @IsString()
    @MinLength(2)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    
    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString()
    @MinLength(2)
    obra?: string;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags: string[];

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[]
}
