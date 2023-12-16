import express from 'express';
import {
	crearUsuario,
	crearUsuarioView,
	editarUsuario,
	editarUsuarioView,
	listadoUsuarios,
} from '../controllers/usuario.controller';

const usuariosRoutes = express.Router();

//carga del listado de usuarios
usuariosRoutes.get('/listado', listadoUsuarios);

//carga de vista y creacion de usuario
usuariosRoutes.get('/crear', crearUsuarioView);
usuariosRoutes.post('/crear', crearUsuario);

//carga y edición de usuario
usuariosRoutes.get('/editar/:idUsuario', editarUsuarioView);
usuariosRoutes.post('/editar/:idUsuario', editarUsuario);

export default usuariosRoutes;
