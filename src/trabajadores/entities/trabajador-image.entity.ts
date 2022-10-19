import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trabajador } from ".";


@Entity()
export class TrabajadorImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        ()=> Trabajador,
        (trabajador)=> trabajador.images,
        {onDelete: 'CASCADE'}
    )
    trabajador: Trabajador

}