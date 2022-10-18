import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TrabajadorImage } from './trabajador-image.entity';

@Entity()
export class Trabajador {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    primerApellido: string;

    @Column('text')
    segundoApellido: string;

    @Column('text')
    oficioOprofesion: string;

    @OneToMany(
        ()=> TrabajadorImage,
        (trabajadorImage)=>trabajadorImage.trabajador,
        {
            cascade: true,
            eager: true
        }
    )
        images?: TrabajadorImage[];



}
