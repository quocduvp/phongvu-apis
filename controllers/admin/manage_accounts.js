import {Router} from 'express'
import jwt from 'jsonwebtoken'
import { verifyToken, secret_admin } from '../../config/verifyToken.config';
import { getAllAccounts, getAccounts } from '../../models/admin/manage_accounts.model';
const route = Router()

route.get("/admin/accounts",verifyToken,(req,res)=>{
    //check number value
    const page = Number.isInteger(Number(req.query.page)) ? req.query.page >= 1 ? req.query.page : 1 : 1
    const page_size =Number.isInteger(Number(req.query.page_size)) ? req.query.page_size >= 1 ? req.query.page_size : 1 : 1
    // verify
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            getAllAccounts(page,page_size).then(r=>{
                res.status(200).json(r)
            }).catch(()=>{
                res.sendStatus(400)
            })
        }else res.sendStatus(401)
    })
}).get("/admin/accounts/:id([0-9]+)",verifyToken,(req,res)=>{
    const { id } = req.params
    jwt.verify(req.token,secret_admin,(err,authData)=>{
        if(err) res.sendStatus(401)
        else if(authData){
            getAccounts({id}).then(r=>{
                res.status(200).json(r)
            }).catch(()=>{
                res.sendStatus(400)
            })
        }else res.sendStatus(401)
    })
})

export default route