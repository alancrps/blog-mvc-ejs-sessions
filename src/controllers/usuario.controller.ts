import { Request, Response } from 'express';
import {
	IUsuarios_create,
	IUsuarios_update,
} from '../interfaces/usuarios/usuarios.interface';
import { dbcontext } from '../db/dbcontext';
import { Usuarios } from '../models/usuarios.entity';
import bcrypt from 'bcrypt';

export const listadoUsuarios = async (req: Request, res: Response) => {
	try {
		const usuarioRepository = await dbcontext.getRepository(Usuarios);
		const usuarios = await usuarioRepository.find({
			order: {
				create_at: 'DESC',
			},
			withDeleted: true,
		});
		res.render('usuarios/listado', { usuarios });
	} catch (error) {}
};

export const crearUsuarioView = async (req: Request, res: Response) => {
	try {
		res.render('usuarios/crear', {});
	} catch (error) {}
};

export const crearUsuario = async (req: Request, res: Response) => {
	try {
		const data: IUsuarios_create = req.body;
		if (data.password !== data.password2) {
			res.render('shared/error');
			throw new Error('Contraseñas no coinciden');
		}
		const usuarioRepository = await dbcontext.getRepository(Usuarios);
		const usuario = await usuarioRepository.create({
			...data,
		});
		const result = await usuarioRepository.save(usuario);
		res.status(200).redirect('/usuarios/listado');
	} catch (error) {
		console.error(error);
	}
};

export const editarUsuarioView = async (req: Request, res: Response) => {
	try {
		const idUsuario = req.params.idUsuario;

		const noticiaRepository = dbcontext.getRepository(Usuarios);

		const usuario = await noticiaRepository.findOne({
			where: {
				id: idUsuario,
			},
		});
		if (!usuario) {
			res.render('shared/error');
		}
		res.render('usuarios/editar', { usuario });
	} catch (error) {
		res.render('shared/error');
	}
};

export const editarUsuario = async (req: Request, res: Response) => {
	try {
		const usuarioRepository = await dbcontext.getRepository(Usuarios);
		const usuario = await usuarioRepository.exist({
			where: {
				id: req.params.idUsuario,
			},
		});
		if (!usuario) {
			res.render('shared/error');
		}

		// Comparacion pw
		const usuarioAComparar = await usuarioRepository.findOneBy({
			id: req.params.idUsuario,
		});
		if (usuarioAComparar) {
			const comparacion = await bcrypt.compare(
				req.body.password,
				usuarioAComparar.password
			);
			if (comparacion) {
				const editarUsuario: IUsuarios_update = {
					nombre: req.body.nombre,
					apellido: req.body.apellido,
				};
				await usuarioRepository.update(req.params.idUsuario, editarUsuario);
			} else {
				console.log('contraseña incorrecta')
				res.render('shared/error');
			}
		}

		res.status(200).redirect('/usuarios/listado');
	} catch (error) {
		console.log(error);
		res.render('shared/error');
	}
};