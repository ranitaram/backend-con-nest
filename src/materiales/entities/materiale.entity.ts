import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MaterialImage } from ".";


@Entity()
export class Material {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;
    
    @Column('text',{
        nullable: true
    })
    description: string;
    
    @Column('int',{
        default: 0
    })
    stock: number;

    @Column('text')
    obra: string;

    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        ()=> MaterialImage,
        (materialImage)=> materialImage.material,
        {cascade:true}
    )
    images?: MaterialImage[];

    


}


