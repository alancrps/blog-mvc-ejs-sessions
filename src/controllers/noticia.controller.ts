import { Request, Response } from 'express';
import { Inoticias_create } from '../interfaces/noticias/noticia.interfaces';
import { dbcontext } from '../db/dbcontext';
import { Noticia } from '../models/noticias.entity';
import logger from '../helpers/logger';
import { ILike } from 'typeorm';

export const crearNoticiaView = (req: Request, res: Response) => {
	res.render('noticias/crear');
};

export const crearNoticia = async (req: Request, res: Response) => {
	try {
		const data: Inoticias_create = req.body;
		const noticiaRepository = await dbcontext.getRepository(Noticia);

		const noticia = await noticiaRepository.create({
			...data,
		});

		if (data.titulo.trim() === '' || data.contenido.trim() === '') {
			res.render('shared/error');
			return;
		}

		const result = await noticiaRepository.save(noticia);

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

export const cargarNoticias = async (req: Request, res: Response) => {
	try {
		const noticiaRepository = await dbcontext.getRepository(Noticia);

		const noticias = await noticiaRepository.find({
			order: {
				create_at: 'DESC',
			},
			take: 10,
		});
		// const noticia2 = JSON.stringify(noticia)

		// console.log(noticia)

		res.render('home/index_view_noticias', {
			noticias,
			total: noticias.length,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getNoticiaById = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.id?.toString();
		const noticiaRepository = await dbcontext.getRepository(Noticia);

		const noticia = await noticiaRepository.findOne({
			where:{
				id: idNoticia,
			}
		});
		console.log(noticia);

		res.render('noticias/noticia', { noticia });
	} catch (error) {
		console.log(error);
	}
};
