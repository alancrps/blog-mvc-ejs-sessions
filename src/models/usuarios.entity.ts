import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import bcrypt from 'bcrypt';
import { Noticia } from './noticias.entity';

@Entity()
export class Usuarios {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	nombre: string;

	@Column()
	apellido: string;
	
	@CreateDateColumn()
	create_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	delete_at: Date;

	@OneToMany(() => Noticia, (n) => n.usuario)
	noticias: Noticia[];

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10);
	}

	@BeforeInsert()
	async toLowerCaseNormalize (){
		this.email = this.email.toLowerCase();
	}
}
