import {Router} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import {
    verifyToken,
    secret_admin
} from '../../../config/verifyToken.config';
import { getListOrders } from '../../../models/admin/Orders/orders.model';
const fd = multer().fields([])
const route = Router()

route.get("/admin/list_orders",verifyToken,(req,res)=>{
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            getListOrders()
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })
})

export default route