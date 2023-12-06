import express from 'express';
import {
	cargarNoticias,
	crearNoticia,
	crearNoticiaView,
	getNoticiaById,
} from '../controllers/noticia.controller';

const noticiasRoutes = express.Router();

noticiasRoutes.get('/', cargarNoticias);

noticiasRoutes.get('/crear', crearNoticiaView);
noticiasRoutes.post('/crear', crearNoticia);

noticiasRoutes.get('/:idNoticia', getNoticiaById);

export default noticiasRoutes;
