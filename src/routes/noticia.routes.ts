import express from 'express';
import { cargarNoticias, crearNoticia, crearNoticiaView, noticiasIndex } from '../controllers/noticia.controller';

const noticiasRoutes = express.Router();

noticiasRoutes.get('/', noticiasIndex)

noticiasRoutes.get('/crear', crearNoticiaView);
noticiasRoutes.post('/crear', crearNoticia)

noticiasRoutes.get('/all', cargarNoticias)

export default noticiasRoutes;
