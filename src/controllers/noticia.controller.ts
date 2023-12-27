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


export const cargarNoticiasIndex = async (req: Request, res: Response) => {
	try {
		const noticiaRepository = await dbcontext.getRepository(Noticia);
		const auth_usuario = req.session?.user;
		
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
			auth_usuario,
			noticiasFormateadas,
			limitadorTexto: (text: string, maxLength: number) =>
				limitadorTexto(text, maxLength),
		});
	} catch (error) {
		
		console.log(error);
		res.render('shared/error', { msgError: `Error al cargar las noticias` });
	}
};

export const crearNoticiaView = (req: Request, res: Response) => {
	const auth_usuario = req.body.usuario;
	res.render('noticias/crear', { auth_usuario});
};

export const crearNoticia = async (req: Request, res: Response) => {
	try {
		const data: Inoticias_create = req.body;
		const noticiaRepository = await dbcontext.getRepository(Noticia);
		if (
			data.titulo.trim() == '' ||
			data.contenido.trim() == '' ||
			data.imageURL == ''
		) {
			return res.render('shared/error', {
				msgError: 'Por favor, completa todos los campos',
			});
		}
		
		const noticia = await noticiaRepository.create({
			...data,
		});
		const result = await noticiaRepository.save(noticia);

		res.status(200).redirect('/noticias');
	} catch (error) {
		console.log(error);
		res.render('shared/error', { msgError: 'Error al crear la noticia' });
	}
};


export const getNoticiaById = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.idNoticia;
		const auth_usuario = req.session?.user;
		const noticiaRepository = await dbcontext.getRepository(Noticia);
		const noticia = await noticiaRepository.findOneBy({
			id: idNoticia,
		});
		if (noticia) {
			//En cada salto de linea se reemplaza por un <br>
			noticia.contenido = noticia.contenido.replace(/\n/g, '<br>');
			
			const formatearFechaNoticia = formatearFecha(noticia);
			res.render('noticias/noticia', { noticia: formatearFechaNoticia, auth_usuario });
		} else {
			res.render('shared/error', {
				msgError: `No se pudo encontrar la noticia`,
			});
		}
	} catch (error) {
		console.log(error);
		res.render('shared/error', { msgError: `Error al obtener la noticia` });
	}
};

export const listadoNoticias = async (req: Request, res: Response) => {
	try {
		const noticiaRepository = await dbcontext.getRepository(Noticia);
		const auth_usuario = req.body.usuario;
		const noticias = await noticiaRepository.find({
			order: {
				create_at: 'DESC',
			},
			withDeleted: true,
		});
		const noticiasFormateadas = formatearFechas(noticias);

		res.render('noticias/listado', { noticiasFormateadas, auth_usuario });
	} catch (error) {
		console.log(error);
		res.render('shared/error', { msgError: 'Error al obtener las noticias' });
	}
};

export const editarNoticiaView = async (req: Request, res: Response) => {
	try {
		const idNoticia = req.params.idNoticia;
		// const auth_usuario = req.body.usuario;
		const noticiaRepository = await dbcontext.getRepository(Noticia);

		const noticia = await noticiaRepository.findOne({
			where: {
				id: idNoticia,
			},
		});
		
		if (!noticia) {
			res.render('shared/error', {
				msgError: 'No se pudo encontrar la noticia',
			});
		}
		res.render('noticias/editar', { noticia,  });
	} catch (error) {
		console.log(error);
		res.render('shared/error', { msgError: 'Error al editar noticia' });
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
			res.render('shared/error', {
				msgError: 'No se pudo encontrar la noticia',
			});
		}
		const editarNoticia: Inoticias_update = {
			titulo: req.body.titulo,
			imageURL: req.body.imageURL,
			contenido: req.body.contenido,
		};
		await noticiaRepository.update(idNoticia, editarNoticia);

		res.status(200).redirect('/noticias/listado');
	} catch (error) {
		console.log(error);
		res.render('shared/error', { msgError: 'Error al editar la noticia' });
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
			res.render('shared/error', {
				msgError: 'No se pudo encontrar la noticia',
			});
		}
		await noticiaRepository.softDelete(idNoticia);
		res.redirect('/noticias/listado');
	} catch (error) {
		console.log(error);
		res.render('shared/error', { msgError: 'Error al eliminar la noticia' });
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
		res.render('shared/error', { msgError: 'Error al recuperar la noticia' });
	}
};

const limitadorTexto = (text: string, maxLength: number) => {
	if (text.length > maxLength) {
		const textoLimitado = text.substring(0, maxLength) + '...';
		return textoLimitado;
	}
	return text;
};

const formatearFechas = (noticias: Noticia[]) => {
	return noticias.map((noticia) => ({
		...noticia,
		create_at: format(noticia.create_at, 'dd/MM/yyyy HH:mm'),
		updated_at: format(noticia.updated_at, 'dd/MM/yyyy HH:mm'),
		delete_at: isValid(noticia.delete_at)
			? format(noticia.delete_at, 'dd/MM/yyyy HH:mm')
			: null,
	}));
};

const formatearFecha = (noticia: Noticia) => ({
	...noticia,
	create_at: format(noticia.create_at, 'dd/MM/yyyy HH:mm'),
	updated_at: format(noticia.updated_at, 'dd/MM/yyyy HH:mm'),
	delete_at: isValid(noticia.delete_at)
		? format(noticia.delete_at, 'dd/MM/yyyy HH:mm')
		: null,
});
