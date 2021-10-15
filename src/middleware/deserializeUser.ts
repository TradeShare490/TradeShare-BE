import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/authentication/jwt.utils";


const desirializeUser = (req: Request, res: Response, next: NextFunction) => {

    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "")

    const refreshToken = get(req, "headers.x-refresh")
    if(!accessToken){
        return next()
    }

    const {decoded, expired} = verifyJwt(accessToken)

    if(decoded){
        res.locals.user = decoded
        return next();
    }

    if(expired && refreshToken) {
        
    }
};

export default desirializeUser;