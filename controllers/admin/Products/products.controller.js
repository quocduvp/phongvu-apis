import {Router} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import {
    verifyToken,
    secret_admin
} from '../../../config/verifyToken.config';
import { addNewProduct, editProduct } from '../../../models/admin/Products/products.model';
const fd = multer().fields([])
const route = Router()

route.post("/admin/products",[fd,verifyToken],(req,res)=>{
    const {
        brand_id,
        name, price,
        qty,sales,
        shipping_price,
        description
    } = req.body
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            addNewProduct({
                brand_id,
                name, price,
                qty,sales,
                shipping_price,
                description
            }).then(r=>res.status(200).json(r))
            .catch(err=>res.status(400).json(err))
        }else res.sendStatus(401)
    })
}).put("/admin/products/:id([0-9]+)",[fd,verifyToken],(req,res)=>{
    const { id } = req.params
    const {
        brand_id,
        name, price,
        qty,sales,
        shipping_price,
        description
    } = req.body
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            editProduct(id,{
                brand_id,
                name, price,
                qty,sales,
                shipping_price,
                description
            }).then(r=>res.status(200).json(r))
            .catch(err=>res.status(400).json(err))
        }else res.sendStatus(401)
    })
}).delete("/admin/products/:id([0-9]+)",verifyToken,(req,res)=>{
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){

        }else res.sendStatus(401)
    })    
})

export default route