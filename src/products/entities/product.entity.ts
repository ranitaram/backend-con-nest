//es lo que va a buscar tyorm para crearse la referencia en la base de datos
//el entity es la representacion de este objeto en la 

import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from ".";

//base de datos osea este entity seria una tabla
@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;

    //su valor por defecto sera 0
    @Column('float',{
        default: 0
    })
    price: number;

    @Column({
        type: 'text', 
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text',{
        array:true
    })
    sizes: string[]

    @Column('text')
    gender: string;

    @Column('text',{
        array:true,
        default: []
    })
    tags: string[];
    
    
    //image
    //construimos la relacion con la tabla productImage
    @OneToMany(
        ()=> ProductImage,
        (productImage)=> productImage.product,
        {cascade: true}
    )
    images?: ProductImage;


    @BeforeInsert()
    checkSlugInsert(){
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
        .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
        .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }
}
