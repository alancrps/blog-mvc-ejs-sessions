import { Request, Response } from 'express';
import { Inoticias_create } from '../interfaces/noticias/noticia.interfaces';
import { dbcontext } from '../db/dbcontext';
import { Noticia } from '../models/noticias.entity';
import logger from '../helpers/logger';
import { ILike } from 'typeorm';
import moment from 'moment';

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

		if (data.titulo.trim() == '' || data.contenido.trim() == '') {
			throw new Error('Esta vacio');
		}

		const result = await noticiaRepository.save(noticia);

		res.status(200).redirect('/noticias');
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

		res.render('home/index_view_noticias', {
			noticias,
			limitadorTexto: (text: string, maxLength: number) =>
				limitadorTexto(text, maxLength),
		});
	} catch (error) {
		console.log(error);
	}
};

export const getNoticiaById = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.idNoticia;
		const noticiaRepository = dbcontext.getRepository(Noticia);
		const noticia = await noticiaRepository.findOneBy({
			id: idNoticia,
		});
		// console.log(noticia);

		res.render('noticias/noticia', { noticia });
	} catch (error) {
		console.log(error);
	}
};

export const listadoNoticias = async (req: Request, res: Response) => {
	try {
		const noticiaRepository = await dbcontext.getRepository(Noticia);

		const noticias = await noticiaRepository.find({
			order: {
				create_at: 'DESC',
			},
		});
		res.render('noticias/listado', { noticias });
	} catch (error) {
		console.log(error);
	}
};

export const editarNoticiaView = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.idNoticia;

		const noticiaRepository = dbcontext.getRepository(Noticia);

		const noticia = await noticiaRepository.findOneBy({
			id: idNoticia,
		});

		
		res.render('noticias/editar', { noticia });
	} catch (error) {
		console.log(error)
	}
};

export const editarNoticia = async (req: Request, res: Response) => {
	const idNoticia = req.params.idNoticia;
	const data: Inoticias_create = req.body
	const noticiaRepository = dbcontext.getRepository(Noticia);
	const noticiaActualizada = await noticiaRepository.update(idNoticia, data)
	res.status(200).redirect('/noticias');
};

const limitadorTexto = (text: string, maxLength: number) => {
	if (text.length > maxLength) {
		const textoLimitado = text.substring(0, maxLength) + '...';
		return textoLimitado;
	}
	return text;
};
