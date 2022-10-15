import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from ".";

//recordar importar el productImage en el products.Module
@Entity()
export class ProductImage {

    //si lo dejamos asi el Primary, por defecto usara el de incrementar
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    //importarlo del index
    //esto no es una columna sino una relacion
    @ManyToOne(
        ()=> Product,
        (product)=> product.images
    )
    product: Product
}