import { NextFunction, Request, Response } from "express";

export const authMiddleware = (req:Request, res: Response, next:NextFunction) => {
    if(!req.session?.user){
        return res.redirect('/auth/login')
    }
    req.body.usuario = req.session.user;
    next()
}