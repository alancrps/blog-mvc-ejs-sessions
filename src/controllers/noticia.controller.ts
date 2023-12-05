import { Request, Response } from 'express';
import { Inoticias_create } from '../interfaces/noticias/noticia.interfaces';
import { dbcontext } from '../db/dbcontext';
import { Noticia } from '../models/noticias.entity';
import logger from '../helpers/logger';
import { ILike } from 'typeorm';

// export const noticiasIndex = (req: Request, res: Response) => {
// 	const nombre = 'Usuario';
// 	res.render('home/index', { nombre });
// };

export const crearNoticiaView = (req: Request, res: Response) => {
	res.render('noticias/crear');
};

export const crearNoticia = async (req: Request, res: Response) => {
	try {
		const data: Inoticias_create = req.body;
		const noticiaRepository = await dbcontext.getRepository(Noticia);

		const noticia = await noticiaRepository.create({
			titulo: data.titulo_noticia,
			contenido: data.desc_noticia
		});
		
		const result = await noticiaRepository.save(noticia);

		if (data.titulo_noticia.trim() === '' || data.desc_noticia.trim() === '') {
			res.render('shared/error');
		}

		// logger.debug(
		// 	`El usuario con nombre : ${req.usuario.nombre} ${
		// 		req.usuario.apellido
		// 	} creo la noticia ${JSON.stringify(data)}`
		// );

		res.redirect('/noticias');
	} catch (error) {
		console.log(error);
		res.render('shared/error');
	}
};

export const cargarNoticias = async (req: Request, res:Response) => {
	try {
		const titulo = req.query.titulo_noticia?.toString();
		const contenido = req.query.desc_noticia?.toString();
		const idNoticia = req.query.id?.toString();
		const noticiaRepository = await dbcontext.getRepository(Noticia)

		const noticia= await noticiaRepository.find({
			where:{
				titulo: ILike(`%${titulo || ''}%`),
				contenido: ILike(`%${contenido || ''}%`),
				id: idNoticia,
			}
		})
		// const noticia2 = JSON.stringify(noticia)

		console.log(noticia)
		const nombre = 'Usuario';

		res.render('home/index', {noticia, nombre})
		
	} catch (error) {
		
	}
	
}

