import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import { verifyToken, secret_admin } from '../../../config/verifyToken.config';
import { getListTags, addSubCategories, updateSubCategories, deleteSubCategories } from '../../../models/admin/Menu/sub_categories.model';
const route = Router()
const formdata = multer().fields([])

route.get("/tags",(req,res)=>{
    getListTags().then(r=>res.status(200).json(r))
    .catch(err=>res.sendStatus(404))
}).post("/admin/sub_categories",[formdata,verifyToken],(req,res)=>{
    const {category_id,sub_category_name} = req.body
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            addSubCategories({category_id,sub_category_name})
            .then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(400))
        }else res.sendStatus(401)
    })    
}).put("/admin/sub_categories/:id([0-9]+)",[formdata,verifyToken],(req,res)=>{
    const {id} = req.params
    const {category_id,sub_category_name} = req.body
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            updateSubCategories(id,{category_id,sub_category_name}).then(r=>res.status(200).json(r)).catch(err=>res.sendStatus(400))
        }else res.sendStatus(401)
    })
}).delete("/admin/sub_categories/:id([0-9]+)",verifyToken,(req,res)=>{
    const {id} = req.params
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            deleteSubCategories(id)
            .then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus())
        }else res.sendStatus(401)
    })
})

export default route