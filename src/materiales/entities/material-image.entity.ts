import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Material } from '.';


@Entity()
export class MaterialImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @ManyToOne(
        ()=>Material,
        (material)=> material.images
    )
    material: Material

}