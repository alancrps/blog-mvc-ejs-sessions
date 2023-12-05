import { Request, Response } from 'express';
import { Inoticias_create } from '../interfaces/noticias/noticia.interfaces';
import { dbcontext } from '../db/dbcontext';
import { Noticia } from '../models/noticias.entity';
import logger from '../helpers/logger';

export const noticiasIndex = (req: Request, res: Response) => {
	const nombre = 'Usuario';
	res.render('home/index', { nombre });
};

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

		//validación datos en blanco
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

