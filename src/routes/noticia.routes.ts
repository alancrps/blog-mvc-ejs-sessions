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

const noticiasRoutes = express.Router();

noticiasRoutes.get('/', cargarNoticiasIndex);

noticiasRoutes.get('/crear', crearNoticiaView);
noticiasRoutes.post('/crear', crearNoticia);

noticiasRoutes.get('/get/:idNoticia', getNoticiaById);
noticiasRoutes.get('/listado', listadoNoticias)

noticiasRoutes.get('/editar/:idNoticia', editarNoticiaView)
noticiasRoutes.post('/editar/:idNoticia', editarNoticia)

noticiasRoutes.get('/eliminar/:idNoticia', eliminarNoticia)
noticiasRoutes.get('/recuperar/:idNoticia', recuperarNoticia)

export default noticiasRoutes;
