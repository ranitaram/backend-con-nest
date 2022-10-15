import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//recordar importar el productImage en el products.Module
@Entity()
export class ProductImage {

    //si lo dejamos asi el Primary, por defecto usara el de incrementar
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;
}