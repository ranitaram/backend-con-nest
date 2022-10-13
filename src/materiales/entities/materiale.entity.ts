import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Material {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        
    })
    title: string;

    @Column('numeric', {
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
    obra: string

    


}


