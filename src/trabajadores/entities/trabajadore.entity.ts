import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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




}
