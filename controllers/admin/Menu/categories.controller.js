import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import { getListCategories, getCategories, updateCategories, deleteCategories, addCategories } from '../../../models/admin/Menu/categories.model';
import { verifyToken, secret_admin } from '../../../config/verifyToken.config';
const route = Router()
const formdata = multer().fields([])
route.get("/categories",(req,res)=>{
    getListCategories().then(r=>res.status(200).json(r))
    .catch(err=>res.sendStatus(404))
}).get("/categories/:id([0-9]+)",(req,res)=>{
    const {id} = req.params
    getCategories({id}).then(r=>res.status(200).json(r))
    .catch(err=>res.sendStatus(404))
}).put("/admin/categories/:id([0-9]+)",[formdata,verifyToken],(req,res)=>{
    const {id} = req.params
    const {menus_id,category_name} = req.body
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            updateCategories(id,{menus_id,category_name}).then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(400))
        }else res.sendStatus(401)
    })
}).delete("/admin/categories/:id([0-9]+)",verifyToken,(req,res)=>{
    const {id} = req.params
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            deleteCategories({id}).then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(404))
        }else res.sendStatus(401)
    })
}).post("/admin/categories",[formdata,verifyToken],(req,res)=>{
    const {menus_id,category_name} = req.body
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            addCategories({menus_id,category_name}).then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(400))
        }else res.sendStatus(401)
    })
})

export default route