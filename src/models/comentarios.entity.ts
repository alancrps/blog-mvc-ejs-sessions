import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Noticia } from './noticias.entity';

@Entity()
export class Comentario {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	comentario: string;

	@CreateDateColumn()
	create_at: Date;

	@ManyToOne(() => Noticia, (n) => n.comentarios, { nullable: false })
	noticia: Noticia;
}
