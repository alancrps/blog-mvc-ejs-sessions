import express from 'express';
import {
	cargarNoticias,
	crearNoticia,
	crearNoticiaView,
	editarNoticia,
	editarNoticiaView,
	getNoticiaById,
	listadoNoticias,
} from '../controllers/noticia.controller';

const noticiasRoutes = express.Router();

noticiasRoutes.get('/', cargarNoticias);

noticiasRoutes.get('/crear', crearNoticiaView);
noticiasRoutes.post('/crear', crearNoticia);

noticiasRoutes.get('/get/:idNoticia', getNoticiaById);
noticiasRoutes.get('/listado', listadoNoticias)

noticiasRoutes.get('/editar/:idNoticia', editarNoticiaView)
noticiasRoutes.post('/editar/:idNoticia', editarNoticia)

export default noticiasRoutes;
