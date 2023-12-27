import express from 'express';
import {
	cargarNoticiasIndex,
	crearNoticia,
	crearNoticiaView,
	editarNoticia,
	editarNoticiaView,
	eliminarNoticia,
	getNoticiaById,
	listadoNoticias,
	recuperarNoticia,
} from '../controllers/noticia.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const noticiasRoutes = express.Router();

noticiasRoutes.get('/', cargarNoticiasIndex);
noticiasRoutes.get('/get/:idNoticia', getNoticiaById);

noticiasRoutes.get('/crear', authMiddleware, crearNoticiaView);
noticiasRoutes.post('/crear', authMiddleware, crearNoticia);

noticiasRoutes.get('/listado', authMiddleware, listadoNoticias)

noticiasRoutes.get('/editar/:idNoticia', authMiddleware, editarNoticiaView)
noticiasRoutes.post('/editar/:idNoticia', authMiddleware, editarNoticia)

noticiasRoutes.get('/eliminar/:idNoticia', authMiddleware, eliminarNoticia)
noticiasRoutes.get('/recuperar/:idNoticia', authMiddleware	, recuperarNoticia)

export default noticiasRoutes;
