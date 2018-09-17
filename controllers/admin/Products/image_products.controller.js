import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import { verifyToken, secret_admin } from '../../../config/verifyToken.config';
import { uploadImageProduct, editImageProduct, deleteImageProduct } from '../../../models/admin/Products/images_product.model';

const route = Router()
//upload config
const formdata = multer({storage: multer.diskStorage({
    filename: function (req, file, callback) { 
        const ori =  file.originalname
        callback(null, ori.substring(0,(ori.length -4)));
    }}),
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
            return cb(new Error('Only image files are allowed! ex: jpg|jpeg|png|gif'));
        }
        if(file.size >= 5242880){
            return cb(new Error('More than size!'));
        } //5mb
        cb(null, true);
    }
}).single('source')

//
route.post("/admin/products/:product_id([0-9+])/images",[formdata,verifyToken],(req,res)=>{
    const {product_id} = req.params
    const file = req.file
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData && file){
            uploadImageProduct({product_id},file)
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(400).json(err))
        }else res.sendStatus(400)
    })
}).put("/admin/products/:product_id([0-9+])/images/:image_id([0-9]+)",[formdata,verifyToken],(req,res)=>{
    const {product_id,image_id} = req.params
    const file = req.file
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData && file){
            editImageProduct({product_id,image_id},file)
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(400)
    })
}).delete("/admin/products/:product_id([0-9+])/images/:image_id([0-9]+)",verifyToken,(req,res)=>{
    const {product_id,image_id} = req.params
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            deleteImageProduct({image_id,product_id})
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })   
})

export default route