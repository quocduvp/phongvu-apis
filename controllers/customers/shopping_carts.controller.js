import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import { verifyToken, secret_customer } from '../../config/verifyToken.config';
import { addToCart, getCarts, updateQty, removeCarts } from '../../models/customers/shopping_carts.model';
const route = Router()
const formdata = multer().fields([])

route.post('/carts',[formdata,verifyToken],(req,res)=>{
    const { product_id, qty } = req.body
    jwt.verify(req.token,secret_customer,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            const { email } = authData.auth
            addToCart({email,product_id,qty})
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(200).json(err))
        }else res.sendStatus(401)
    })
}).put('/carts/:cart_id([0-9]+)/qty',[formdata,verifyToken],(req,res)=>{
    const {cart_id} = req.params
    const { new_qty } = req.body
    jwt.verify(req.token,secret_customer,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            const { email } = authData.auth
            updateQty({email,cart_id,new_qty})
            .then(r=>{
                res.status(200).json(r)
            }).catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })
}).delete('/carts/:cart_id([0-9]+)',verifyToken,(req,res)=>{
    const {cart_id} = req.params
    jwt.verify(req.token,secret_customer,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            const { email } = authData.auth
            removeCarts({email,cart_id})
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })
}).get('/carts',verifyToken,(req,res)=>{
    jwt.verify(req.token,secret_customer,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            const { email } = authData.auth
            getCarts({email})
            .then(r=>res.status(200).json(r))
            .catch(err=>res.status(404).json(err))
        }else res.sendStatus(401)
    })    
})

export default route