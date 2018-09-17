import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import { verifyToken, secret_admin } from '../../../config/verifyToken.config';
import { addBrands, updateBrands, deleteBrands, getListBrands, getBrandDetails } from '../../../models/admin/Brands/brands.model';
const route = Router()
//upload config
const formdata = multer({storage: multer.diskStorage({
    filename: function (req, file, callback) { 
        const ori =  file.originalname
        callback(null, ori.substring(0,(ori.length -4)));
    }}),
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
            return cb(new Error('Only image files are allowed! ex: jpg|jpeg|png|gif|mp4|avi'));
        }
        if(file.size >= 5242880){
            return cb(new Error('More than size!'));
        } //5mb
        cb(null, true);
    }
}).single('brands_logo')

//
route.get("/brands",(req,res)=>{
    getListBrands().then(r=>res.status(200).json(r))
    .catch(err=>res.status(404).json(err))
}).get("/brands/:id([0-9+])",(req,res)=>{
    const {id} = req.params
    console.log(id)
    getBrandDetails(id)
        .then(r=>res.status(200).json(r))
        .catch(err=>res.sendStatus(404))
}).post("/admin/brands",[formdata,verifyToken],(req,res)=>{
    const { brands_name } = req.body
    const file = req.file
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData && file){
            addBrands({brands_name,file}).then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(400))
        }else res.sendStatus(401)
    })
}).put("/admin/brands/:id([0-9+])",[formdata,verifyToken],(req,res)=>{
    const {id} = req.params
    const { brands_name } = req.body
    const file = req.file
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            updateBrands(id,{brands_name,file})
            .then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(404))
        }else res.sendStatus(401)
    })
}).delete("/admin/brands/:id([0-9+])",verifyToken,(req,res)=>{
    const {id} = req.params
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            deleteBrands(id).then(r=>res.status(200).json(r))
            .catch(err=>res.sendStatus(404))
        }else res.sendStatus(401)
    })   
})

export default route