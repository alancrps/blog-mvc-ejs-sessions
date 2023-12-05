import express from 'express';
import { cargarNoticias, crearNoticia, crearNoticiaView } from '../controllers/noticia.controller';

const noticiasRoutes = express.Router();

noticiasRoutes.get('/', cargarNoticias)

noticiasRoutes.get('/crear', crearNoticiaView);
noticiasRoutes.post('/crear', crearNoticia)


export default noticiasRoutes;
