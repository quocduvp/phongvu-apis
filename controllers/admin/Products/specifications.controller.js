import {Router} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import {
    verifyToken,
    secret_admin
} from '../../../config/verifyToken.config';
import { addSpecification,updateSpecification,deleteSpecification } from '../../../models/admin/Products/specifications.model';
const fd = multer().fields([])
const route = Router()

route.post("/admin/products/:id([0-9]+)/specifications",[fd,verifyToken],(req,res)=>{
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        const {id} = req.params
        const obj = req.body
        if(err) res.sendStatus(401)
        else if(authData){
            addSpecification(id,JSON.stringify(obj))
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(400).json(err))
        }else res.sendStatus(401)
    })
}).put("/admin/products/:id_product([0-9]+)/specifications/:id_spec([0-9]+)",[fd,verifyToken],(req,res)=>{
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        const {id_product,id_spec} = req.params
        const obj = req.body
        if(err) res.sendStatus(401)
        else if(authData){
            updateSpecification({id_product,id_spec},JSON.stringify(obj))
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })
}).delete("/admin/products/:id_product([0-9]+)/specifications/:id_spec([0-9]+)",verifyToken,(req,res)=>{
    const {id_product,id_spec} = req.params
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            deleteSpecification(id_product,id_spec)
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })
})

export default route