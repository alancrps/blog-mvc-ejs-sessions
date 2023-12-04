import {
	BeforeInsert,
	Column,
	CreateDateColumn,
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
	pass: string;

	@Column()
	nombre: string;

	@Column()
	apellido: string;

	@CreateDateColumn()
	create_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(() => Noticia, (n) => n.usuario)
	noticias: Noticia[];

	@BeforeInsert()
	async hashPassword() {
		this.pass = await bcrypt.hash(this.pass, 10);
	}
}
