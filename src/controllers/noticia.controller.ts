import { Request, Response } from 'express';
import {
	Inoticias_create,
	Inoticias_update,
} from '../interfaces/noticias/noticia.interfaces';
import { dbcontext } from '../db/dbcontext';
import { Noticia } from '../models/noticias.entity';
import logger from '../helpers/logger';
import { ILike, IsNull } from 'typeorm';
import { format, isValid } from 'date-fns';

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

export const cargarNoticiasIndex = async (req: Request, res: Response) => {
	try {
		const noticiaRepository = await dbcontext.getRepository(Noticia);

		const noticias = await noticiaRepository.find({
			order: {
				create_at: 'DESC',
			},
			take: 10,
			where: {
				delete_at: IsNull(),
			},
		});

		const noticiasFormateadas = formatearFechas(noticias);

		res.render('home/index_view_noticias', {
			noticiasFormateadas,
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
		const noticiaRepository = await dbcontext.getRepository(Noticia);
		const noticia = await noticiaRepository.findOneBy({
			id: idNoticia,
		});
		
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
			withDeleted: true,
		});
		const noticiasFormateadas = formatearFechas(noticias)

		res.render('noticias/listado', { noticiasFormateadas});
	} catch (error) {
		console.log(error);
		res.render('shared/error');
	}
};

export const editarNoticiaView = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.idNoticia;

		const noticiaRepository = await dbcontext.getRepository(Noticia);

		const noticia = await noticiaRepository.findOne({
			where: {
				id: idNoticia,
			},
		});
		if (!noticia) {
			res.render('shared/error');
		}
		res.render('noticias/editar', { noticia });
	} catch (error) {
		console.log(error);
		res.render('shared/error');
	}
};

export const editarNoticia = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.idNoticia;
		const noticiaRepository = await dbcontext.getRepository(Noticia);
		const noticia = await noticiaRepository.exist({
			where: {
				id: idNoticia,
			},
		});
		if (!noticia) {
			res.render('shared/error');
		}
		const editarNoticia: Inoticias_update = {
			titulo: req.body.titulo,
			contenido: req.body.contenido,
		};
		await noticiaRepository.update(idNoticia, editarNoticia);

		res.status(200).redirect('/noticias/listado');
	} catch (error) {
		console.log(error);
		res.render('shared/error');
	}
};

export const eliminarNoticia = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.idNoticia;
		const noticiaRepository = await dbcontext.getRepository(Noticia);
		const noticia = await noticiaRepository.findOne({
			where: {
				id: idNoticia,
			},
		});
		if (!noticia) {
			res.render('shared/error');
		}
		await noticiaRepository.softDelete(idNoticia);
		res.redirect('/noticias/listado');
	} catch (error) {
		console.log(error);
	}
};

export const recuperarNoticia = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.idNoticia;
		const noticiaRepository = await dbcontext.getRepository(Noticia);
		await noticiaRepository.restore(idNoticia);
		res.redirect('/noticias/listado');
	} catch (error) {
		console.log(error);
	}
};

const limitadorTexto = (text: string, maxLength: number) => {
	if (text.length > maxLength) {
		const textoLimitado = text.substring(0, maxLength) + '...';
		return textoLimitado;
	}
	return text;
};

const formatearFechas = (noticias: Noticia[])=>{
	return noticias.map(noticia => ({
		...noticia,
		create_at: format(noticia.create_at, 'dd/MM/yyyy HH:mm'),
		updated_at: format(noticia.updated_at, 'dd/MM/yyyy HH:mm'),
		delete_at: isValid(noticia.delete_at) ? format(noticia.delete_at, 'dd/MM/yyyy HH:mm' ) : null,
	}))
}
