import { Request, Response } from 'express';

export const loginController = (req: Request, res: Response) => {
	if (req.session) {
		//logica de login
		req.session.user = { id: 1, username: 'Alan' };
		res.send('Usuario logeado correctamente');
	}
};

export const quiensoyController = (req: Request, res: Response) => {
	if (req.session?.user) {
		const user = req.session.user;
		res.render('quiensoy', { user });
	} else {
		res.send('No estas logeado');
	}
};
export const logoutController = (req: Request, res: Response) => {
	req.session?.destroy((err) => {});
	res.send('Sesion cerrada correctamente');
};
