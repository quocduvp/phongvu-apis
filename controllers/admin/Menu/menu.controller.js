import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import { getListMenus, deleteMenus, editMenus, addMenus, getMenus } from '../../../models/admin/Menu/menu.model';
import { verifyToken, secret_admin } from '../../../config/verifyToken.config';
const route = Router()
const formdata = multer().fields([])
route.get("/menus",(req,res)=>{
    getListMenus().then(r=>res.status(200).json(r))
    .catch(err=>res.sendStatus(400))
}).get("/menus/:id([0-9]+)",(req,res)=>{
    const {id} = req.params
    getMenus({id}).then(r=>res.status(200).json(r))
    .catch(err=>res.sendStatus(400))
}).post("/admin/menus",[formdata,verifyToken],(req,res)=>{
    const {menu_name} = req.body
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            addMenus({menu_name}).then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(400))
        }else res.sendStatus(401)
    })
}).put("/admin/menus/:id([0-9]+)",[formdata,verifyToken],(req,res)=>{
    const {id} = req.params
    const {menu_name} = req.body
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            editMenus(id,{menu_name}).then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(404))
        }else res.sendStatus(401)
    })
}).delete("/admin/menus/:id([0-9]+)",verifyToken,(req,res)=>{
    const {id} = req.params
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            deleteMenus(id).then(r=>res.status(200).json(r))
            .catch(err=>res.json(err))
        }else res.sendStatus(401)
    })
})

export default route