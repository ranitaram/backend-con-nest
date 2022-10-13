//es lo que va a buscar tyorm para crearse la referencia en la base de datos
//el entity es la representacion de este objeto en la 

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//base de datos osea este entity seria una tabla
@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;
}
