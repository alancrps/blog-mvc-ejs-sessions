import Request from 'express';
import { IUsuarios } from '../../interfaces/usuarios/usuarios.interface';
declare global {
    namespace Express {
        export interface Request{
            usuario: IUsuarios
        }
    }
}