import {Router} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import {
    verifyToken,
    secret_admin
} from '../../../config/verifyToken.config';
import { addTags, editTags, deleteTags } from '../../../models/admin/Products/tags_product.model';
const fd = multer().fields([])
const route = Router()

route.post('/admin/products/:product_id([0-9]+)/tags',[fd,verifyToken],(req,res)=>{
    const { product_id } = req.params
    const { sub_categories_id } = req.body
    jwt.verify(req.token,secret_admin,(err,auhData)=>{
        if(err) res.sendStatus(401)
        else if(auhData){
            addTags({product_id,sub_categories_id})
            .then(r=>{
                res.status(200).json(r)
            }).catch(err=>res.status(400).json(err))
        }else res.sendStatus(401)
    })
}).put('/admin/products/:product_id([0-9]+)/tags/:tag_id([0-9]+)',[fd,verifyToken],(req,res)=>{
    const { product_id, tag_id } = req.params
    const { sub_categories_id } = req.body
    jwt.verify(req.token,secret_admin,(err,auhData)=>{
        if(err) res.sendStatus(401)
        else if(auhData){
            editTags({tag_id,product_id,sub_categories_id})
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })
}).delete('/admin/products/:product_id([0-9]+)/tags/:tag_id([0-9]+)',[verifyToken],(req,res)=>{
    const { product_id, tag_id } = req.params
    jwt.verify(req.token,secret_admin,(err,auhData)=>{
        if(err) res.sendStatus(401)
        else if(auhData){
            deleteTags({tag_id,product_id})
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })
})

export default route