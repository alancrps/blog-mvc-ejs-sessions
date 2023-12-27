import express from 'express';
import {
	crearUsuario,
	crearUsuarioView,
	editarUsuario,
	editarUsuarioView,
	eliminarUsuario,
	listadoUsuarios,
	recuperarUsuario,
} from '../controllers/usuario.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const usuariosRoutes = express.Router();

//carga del listado de usuarios
usuariosRoutes.get('/listado', authMiddleware, listadoUsuarios);

//carga de vista y creacion de usuario
usuariosRoutes.get('/crear', authMiddleware, crearUsuarioView);
usuariosRoutes.post('/crear', authMiddleware, crearUsuario);

//carga y edición de usuario
usuariosRoutes.get('/editar/:idUsuario', authMiddleware, editarUsuarioView);
usuariosRoutes.post('/editar/:idUsuario', authMiddleware, editarUsuario);

//eliminación de usuario
usuariosRoutes.get('/eliminar/:idUsuario', authMiddleware, eliminarUsuario)

//recuperación de usuario
usuariosRoutes.get('/recuperar/:idUsuario', authMiddleware, recuperarUsuario)
export default usuariosRoutes;
