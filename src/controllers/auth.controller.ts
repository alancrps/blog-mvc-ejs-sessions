import { Request, Response } from 'express';
import { dbcontext } from '../db/dbcontext';
import { Usuarios } from '../models/usuarios.entity';
import bcrypt from 'bcrypt'


export const loginControllerView = (req: Request, res: Response) => {
	res.render('auth/login', {layout: false})
};

export const loginController = async (req: Request, res: Response) => {
	try {
		const usuarioRepository = await dbcontext.getRepository(Usuarios)
		const usuario = await usuarioRepository.findOneBy({
			email: req.body.email
		})
		
		if(usuario){
			const comparacionPassword = await bcrypt.compare(req.body.password, usuario.password)
			
			if(comparacionPassword && req.session){
				req.session.user = {
					id: usuario.id,
					email: usuario.email,
					nombreCompleto: `${usuario.nombre} ${usuario.apellido}`
				}
				res.redirect('/noticias')
			}
			else{
				res.render('shared/error', { msgError: "usuario y/o contraseña incorrecto"} )
			}
		}
		else{
			res.render('shared/error', { msgError: "usuario y/o contraseña incorrecto"} )
		}
	} catch (error) {
		console.log(error);
		res.render('shared/error', { msgError: error });
	}
}

export const quiensoyController = (req: Request, res: Response) => {
	if (req.session?.user) {
		const user = req.session.user;
		res.send({user});
	} else {
		res.send('No estas logeado');
	}
};

export const logoutController = (req: Request, res: Response) => {
	req.session?.destroy((err) => {});
	res.redirect('/noticias')
};
